from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional
from queries.vaccines import (
    VaccineIn,
    VaccineOut,
    VaccineListOut,
    VaccineQueries,
)

router = APIRouter()


@router.delete("/api/vaccines/{vaccine_id}", response_model=bool)
def delete_vaccine(vaccine_id: int, queries: VaccineQueries = Depends()):
    queries.delete_vaccine(vaccine_id)
    return True


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


@router.get("/api/vaccines", response_model=VaccineListOut)
def get_vacccines(queries: VaccineQueries = Depends()):
    return {"vaccines": queries.get_vaccines()}


@router.get("/api/vaccines/{vaccine_id}", response_model=Optional[VaccineOut])
def get_vaccine(
    vaccine_id: int,
    queries: VaccineQueries = Depends(),
):
    record = queries.get_vaccine(vaccine_id)
    if record is None:
        raise HTTPException(
            status_code=404,
            detail="No pet fuond with id {}".format(vaccine_id),
        )
    else:
        return record
