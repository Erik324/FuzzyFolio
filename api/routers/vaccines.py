from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional
from queries.vaccines import VaccineIn, VaccineOut, VaccineListOut, VaccineQueries

router = APIRouter()

@router.post("/api/vaccines", response_model=VaccineOut)
def create_vaccine(
    vaccine: VaccineIn,
    queries: VaccineQueries = Depends(),
):
    try:
        return queries.create_vaccine(vaccine)
    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail="Failed to create a vaccine due to foreign key violation with pet",
        )
