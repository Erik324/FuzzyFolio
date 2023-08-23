from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Union
from queries.vaccines import (
    VaccineIn,
    VaccineOut,
    VaccineListOut,
    VaccineQueries,
    Error,
)
from .authenticator import authenticator

router = APIRouter()


@router.put(
    "/api/vaccines/{vaccine_id}", response_model=Union[VaccineOut, Error]
)
def update_vaccine(
    vaccine_id: int,
    vaccine: VaccineIn,
    repo: VaccineQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> Union[Error, VaccineOut]:
    result = repo.get_vaccine(vaccine_id)
    owner = repo.get_account_by_vaccine_id(vaccine_id)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Vaccine by id {} does not exist".format(vaccine_id),
        )
    elif owner.owner_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        return repo.update_vaccine(vaccine_id, vaccine)


@router.delete("/api/vaccines/{vaccine_id}", response_model=bool)
def delete_vaccine(
    vaccine_id: int,
    queries: VaccineQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    result = queries.get_account_by_vaccine_id(vaccine_id)
    if result.owner_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        queries.delete_vaccine(vaccine_id)
        return True


@router.post("/api/vaccines", response_model=VaccineOut)
def create_vaccine(
    vaccine: VaccineIn,
    queries: VaccineQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    try:
        return queries.create_vaccine(vaccine)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=400,
            detail="Failed to create a vaccine",
        )


@router.get("/api/vaccines", response_model=VaccineListOut)
def get_vacccines(
    queries: VaccineQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    return {"vaccines": queries.get_vaccines()}


@router.get("/api/vaccines/{vaccine_id}", response_model=Optional[VaccineOut])
def get_vaccine(
    vaccine_id: int,
    queries: VaccineQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    record = queries.get_vaccine(vaccine_id)
    owner = queries.get_account_by_vaccine_id(vaccine_id)
    if owner.owner_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        return record
