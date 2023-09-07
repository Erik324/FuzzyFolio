from fastapi import (
    Depends,
    HTTPException,
    status,
    Response,
    APIRouter,
    Request,
)
from psycopg.errors import UniqueViolation
from pydantic import BaseModel
from typing import Optional
from queries.accounts import (
    AccountQueries,
    AccountInWithPassword,
    AccountOutWithPassword,
    AccountOut,
    AccountIn,
    AuthenticationException,
)
from jwtdown_fastapi.authentication import Token
from .authenticator import authenticator


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
    account: AccountOut = Depends(authenticator.try_get_current_account_data),
) -> AccountToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }


@router.get("/api/accountdata", response_model=AccountOut | None)
async def get_account_data(
    account: AccountOut = Depends(authenticator.try_get_current_account_data),
) -> AccountOut | None:
    if account:
        return AccountOut(**account)


@router.get("/api/accounts/{user_id}", response_model=Optional[AccountOut])
def get_account(
    user_id: int,
    queries: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if user_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        try:
            record = queries.get_account_by_id(user_id)
        except AuthenticationException:
            return HTTPException(status.HTTP_401_UNAUTHORIZED)
        return record


@router.put("/api/accounts/{user_id}", response_model=Optional[AccountOut])
def update_account(
    user_id: int,
    account: AccountIn,
    queries: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if user_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        try:
            record = queries.update_account(user_id, account)
            if record is None:
                raise HTTPException(
                    status_code=404,
                    detail="No user found with id {}".format(user_id),
                )
            else:
                return record
        except UniqueViolation:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update account, username is already in use",
            )


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
        form = AccountForm(username=info.username, password=info.password)
        token = await authenticator.login(response, request, form, queries)
        return AccountToken(account=account, **token.dict())
    except UniqueViolation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account, username is already in use",
        )


@router.delete("/api/accounts/{user_id}", response_model=bool)
def delete_account(
    user_id: int,
    queries: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if user_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        queries.delete_account(user_id)
        return True
