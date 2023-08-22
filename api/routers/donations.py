from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional, Union
from queries.donations import (
    DonationIn,
    DonationOut,
    DonationListOut,
    DonationQueries,
    Error,
)
from queries.donations import (
    DonationIn,
    DonationOut,
    DonationListOut,
    DonationQueries,
    Error,
)

router = APIRouter()


@router.put(
    "/api/donations/{donation_id}", response_model=Union[DonationOut, Error]
)
def update_donation(
    donation_id: int,
    pet: DonationIn,
    repo: DonationQueries = Depends(),
) -> Union[Error, DonationOut]:
    return repo.update_donation(donation_id, pet)


@router.post("/api/donations", response_model=DonationOut)
def create_donation(
    donation: DonationIn,
    queries: DonationQueries = Depends(),
):
    try:
        return queries.create_donation(donation)
    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail="Failed to create a donation due to foreign key violation with owner",
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
            detail="No account found with id {}".format(donation_id),
        )
    else:
        return record
