from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional, Union
from queries.donations import DonationIn, DonationOut, DonationListOut, DonationQueries, Error

router = APIRouter()

@router.put("/api/donations/{donation_id}", response_model=Union[DonationOut, Error])
def update_donation(
    donation_id: int,
    pet: DonationIn,
    repo: DonationQueries = Depends(),
) -> Union[Error, DonationOut]:
    return repo.update_donation(donation_id, pet)
