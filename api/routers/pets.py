from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional, Union

from queries.pets import PetIn, PetListOut, PetOut, PetQueries, Error
from psycopg.errors import UniqueViolation

router = APIRouter()


@router.get("/api/pets/{pet_id}", response_model=Optional[PetOut])
def get_pet(
    pet_id: int,
    queries: PetQueries = Depends(),
):
    record = queries.get_pet(pet_id)
    if record is None:
        raise HTTPException(status_code=404, detail="No pet fuond with id {}".format(pet_id))
    else:
        return record
    

@router.get("/api/pets", response_model=PetListOut)
def get_pets(
    queries: PetQueries = Depends()
):
    return {"pets": queries.get_pets()}

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
