from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional

from queries.pets import PetIn, PetListOut, PetOut, PetQueries
from psycopg.errors import UniqueViolation

router = APIRouter()

@router.delete("/api/pets/{pet_id}", response_model=bool)
def delete_pet(
    pet_id: int,
    queries: PetQueries = Depends()
):
    queries.delete_pet(pet_id)
    return True
