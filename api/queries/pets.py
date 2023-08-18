import os
from psycopg_pool import ConnectionPool
from typing import List, Literal
from pydantic import BaseModel


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class PetIn(BaseModel):
    pet_name: str
    picture: str
    age: str
    species: str
    breed: str
    color: str
    weight: int
    disease: str
    medication: str
    allergy: str
    dietary_restriction: str
    description: str
    owner_id: int

class PetOut(PetIn):
    id: int


class PetListOut(BaseModel):
    pets:list[PetOut]


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

