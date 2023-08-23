from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Union
from queries.donations import (
    DonationIn,
    DonationOut,
    DonationListOut,
    DonationQueries,
    Error,
)
from .authenticator import authenticator


router = APIRouter()


@router.put(
    "/api/donations/{donation_id}", response_model=Union[DonationOut, Error]
)
def update_donation(
    donation_id: int,
    donation: DonationIn,
    repo: DonationQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> Union[Error, DonationOut]:
    result = repo.update_donation(donation_id, donation)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Donation by id {} does not exist".format(donation_id),
        )
    elif donation.owner_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        return result


@router.post("/api/donations", response_model=DonationOut)
def create_donation(
    donation: DonationIn,
    queries: DonationQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    try:
        return queries.create_donation(donation)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=400,
            detail="Failed to create doantion",
        )


@router.get("/api/donations", response_model=DonationListOut)
def get_donations(queries: DonationQueries = Depends()):
    return {"donations": queries.get_donations()}


@router.get(
    "/api/donations/{donation_id}", response_model=Optional[DonationOut]
)
def get_donation(
    donation_id: int,
    queries: DonationQueries = Depends(),
):
    record = queries.get_donation(donation_id)
    if record is None:
        raise HTTPException(
            status_code=404,
            detail="No donation found with id {}".format(donation_id),
        )
    else:
        return record


@router.delete("/api/donations/{donation_id}", response_model=bool)
def delete_donation(
    donation_id: int,
    queries: DonationQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    result = queries.get_donation(donation_id)
    if result.owner_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        queries.delete_donation(donation_id)
        return True
