import os
from psycopg_pool import ConnectionPool
from typing import List, Literal, Optional
from pydantic import BaseModel


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class PetIn(BaseModel):
    pet_name: str
    picture: Optional[str]
    age: Optional[int]
    species: Optional[str]
    breed: Optional[str]
    color: Optional[str]
    weight: Optional[int]
    disease: Optional[str]
    medication: Optional[str]
    allergy: Optional[str]
    dietary_restriction: Optional[str]
    description: Optional[str]
    owner_id: int


class PetOut(PetIn):
    id: int


class PetListOut(BaseModel):
    pets: list[PetOut]


class PetQueries:
    def delete_pet(self, id) -> None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM pets
                    WHERE id = %s
                    """,
                    [id],
                )

    def create_pet(self, pet) -> PetOut | None:
        id = None
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO pets (
                    pet_name, picture, age, species, breed, color, weight, disease, medication, allergy, dietary_restriction, description, owner_id
                    )
                    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    [
                        pet.pet_name,
                        pet.picture,
                        pet.age,
                        pet.species,
                        pet.breed,
                        pet.color,
                        pet.weight,
                        pet.disease,
                        pet.medication,
                        pet.allergy,
                        pet.dietary_restriction,
                        pet.description,
                        pet.owner_id,
                    ],
                )

                row = cur.fetchone()
                id = row[0]
                old_data = pet.dict()
                if id is not None:
                    return PetOut(id=id, **old_data)
