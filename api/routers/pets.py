from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Union
from .authenticator import authenticator
from queries.pets import PetIn, PetListOut, PetOut, PetQueries, Error

router = APIRouter()


@router.get("/api/pets/{pet_id}", response_model=Optional[PetOut])
def get_pet(
    pet_id: int,
    queries: PetQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    record = queries.get_pet(pet_id)
    if record.owner_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        if record is None:
            raise HTTPException(
                status_code=404,
                detail="No pet fuond with id {}".format(pet_id),
            )
        else:
            return record


@router.get("/api/pets", response_model=PetListOut)
def get_pets(
    queries: PetQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    return {"pets": queries.get_pets()}


@router.put("/api/pets/{pet_id}", response_model=Union[PetOut, Error])
def update_pet(
    pet_id: int,
    pet: PetIn,
    repo: PetQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> Union[Error, PetOut]:
    if repo.get_pet(pet_id) is None:
        raise HTTPException(
            status_code=404,
            detail="Pet by id {} does not exist".format(pet_id),
        )
    elif pet.owner_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own this pet".format(
                account_data["id"]
            ),
        )
    else:
        return repo.update_pet(pet_id, pet)


@router.delete("/api/pets/{pet_id}", response_model=bool)
def delete_pet(
    pet_id: int,
    queries: PetQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    result = queries.get_pet(pet_id)
    if result.owner_id != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized - current account id {} does not own resource".format(
                account_data["id"]
            ),
        )
    else:
        queries.delete_pet(pet_id)
        return True


@router.post("/api/pets", response_model=PetOut)
def create_pet(
    pet: PetIn,
    queries: PetQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    try:
        return queries.create_pet(pet)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=400,
            detail="Failed to create pet",
        )
