from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional, Union

from queries.pets import PetIn, PetListOut, PetOut, PetQueries, Error
from psycopg.errors import UniqueViolation

router = APIRouter()


@router.put("/api/pets/{pet_id}", response_model=Union[PetOut, Error])
def update_pet(
    pet_id: int,
    pet: PetIn,
    repo: PetQueries = Depends(),
) -> Union[Error, PetOut]:
    return repo.update_pet(pet_id, pet)


@router.delete("/api/pets/{pet_id}", response_model=bool)
def delete_pet(pet_id: int, queries: PetQueries = Depends()):
    queries.delete_pet(pet_id)
    return True


@router.post("/api/pets", response_model=PetOut)
def create_pet(
    pet: PetIn,
    queries: PetQueries = Depends(),
):
    try:
        return queries.create_pet(pet)
    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail="Failed to create truck due to foreign key violation with owner",
        )
