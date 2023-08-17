
from fastapi import (
    Depends,
    HTTPException,
    status,
    Response,
    APIRouter,
    Request,
)
from pydantic import BaseModel
from typing import Optional
from queries.accounts import AccountQueries, AccountInWithPassword, DuplicateAccountError, AccountOutWithPassword, AccountOut, AccountIn
from jwtdown_fastapi.authentication import Token
from .authenticator import MyAuthenticator, authenticator



class AccountForm(BaseModel):
    username: str
    password: str

class AccountToken(Token):
    account: AccountOutWithPassword

class HttpError(BaseModel):
    detail: str


router = APIRouter()


@router.get("/token", response_model=AccountToken | None)
async def get_token(
    request: Request,
    account: AccountOut = Depends(authenticator.try_get_current_account_data)
) -> AccountToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }

@router.get("/api/accounts/{user_id}", response_model=Optional[AccountOut])
def get_account(
    user_id: int,
    queries: AccountQueries = Depends(),
):
    record = queries.get_account(user_id)
    if record is None:
        raise HTTPException(status_code=404, detail="No user found with id {}".format(user_id))
    else:
        return record

@router.put("/api/accounts/{user_id}", response_model=Optional[AccountOut])
def update_account(
    user_id: int,
    account: AccountIn,
    queries: AccountQueries = Depends(),
):
    record = queries.update_account(user_id, account)
    if record is None:
        raise HTTPException(status_code=404, detail="No user found with id {}".format(user_id))
    else:
        return record

# @router.get("/api/accounts", response_model=AccountListOut)
# def get_accounts(
#     queries: AccountQueries = Depends()
# ):
#     return {"accounts": queries.get_all_accounts()}

@router.post("/api/accounts", response_model=AccountToken | HttpError)
async def create_account(
    info: AccountInWithPassword,
    request: Request,
    response: Response,
    queries: AccountQueries = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = queries.create_account(info, hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account with those credentials",
        )
    # review if other field is required
    form = AccountForm(username=info.username, password=info.password)
    token = await authenticator.login(response, request, form, queries)
    return AccountToken(account=account, **token.dict())

@router.delete("/api/accounts/{user_id}", response_model=bool)
def delete_account(
    user_id: int,
    queries: AccountQueries = Depends()
):
    queries.delete_account(user_id)
    return True

