import os
from psycopg_pool import ConnectionPool
from typing import List, Union, Optional
from pydantic import BaseModel


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class Error(BaseModel):
    message: str


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
        try:
            id = None
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO pets (
                        pet_name,
                        picture,
                        age,
                        species,
                        breed,
                        color,
                        weight,
                        disease,
                        medication,
                        allergy,
                        dietary_restriction,
                        description, owner_id
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
        except Exception as e:
            print(e)
            return {"message": "Could not create pet"}

    def update_pet(self, pet_id: int, pet: PetIn) -> Union[PetOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE pets
                        SET pet_name = %s,
                            picture = %s,
                            age = %s,
                            species = %s,
                            breed = %s,
                            color = %s,
                            weight = %s,
                            disease = %s,
                            medication = %s,
                            allergy = %s,
                            dietary_restriction = %s,
                            description = %s,
                            owner_id = %s
                        WHERE id = %s
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
                            pet_id,
                        ],
                    )
                    old_data = pet.dict()
                    return PetOut(id=pet_id, **old_data)
        except Exception as e:
            print(e)
            return {"message": "Could not update pet"}

    def get_pet(self, id) -> PetOut | None:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT *
                        FROM pets
                        WHERE id = %s
                        """,
                        [id],
                    )

                    record = None
                    row = cur.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]

                        return PetOut(**record)
        except Exception as e:
            print(e)
            return {"message": "Could not update your pet"}

    def get_pets(self) -> List[PetOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT *
                        FROM pets
                        ORDER BY pet_name
                        """,
                    )

                    results = []
                    for row in cur.fetchall():
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        results.append(PetOut(**record))

                    return results
        except Exception as e:
            print(e)
            return {"message": "Could not retrieve your pets"}
