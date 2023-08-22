import os
from psycopg_pool import ConnectionPool
from typing import List, Optional, Union
from pydantic import BaseModel
from datetime import date


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])

class Error(BaseModel):
    message: str

class VaccineIn(BaseModel):
    vaccine_name: str
    clinic: Optional[str]
    received_date: Optional[date]
    due_date: Optional[date]
    pet_id: int


class VaccineOut(VaccineIn):
    id: int


class VaccineListOut(BaseModel):
    vaccines: list[VaccineOut]


class VaccineQueries:
    def create_vaccine(self, vaccine) -> VaccineOut | None:
        id = None
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                        INSERT INTO vaccines (
                        vaccine_name, clinic, received_date, due_date, pet_id
                        )
                        VALUES(%s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                    [
                        vaccine.vaccine_name,
                        vaccine.clinic,
                        vaccine.received_date,
                        vaccine.due_date,
                        vaccine.pet_id,
                    ],
                )

                row = cur.fetchone()
                id = row[0]
                old_data = vaccine.dict()
                if id is not None:
                    return VaccineOut(id=id, **old_data)

    def get_vaccines(self) -> List[VaccineOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM vaccines
                    ORDER BY pet_id
                    """,
                )

                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(VaccineOut(**record))

                return results

    def get_vaccine(self, id) -> VaccineOut | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM vaccines
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

                    return VaccineOut(**record)

    def update_vaccine(self, vaccine_id: int, vaccine: VaccineIn) -> Union[VaccineOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE vaccines
                        SET vaccine_name = %s,
                            clinic = %s,
                            received_date = %s,
                            due_date = %s,
                            pet_id = %s
                        WHERE id = %s
                        """,
                        [
                            vaccine.vaccine_name,
                            vaccine.clinic,
                            vaccine.received_date,
                            vaccine.due_date,
                            vaccine.pet_id,
                            vaccine_id,
                        ],
                    )

                    old_data = vaccine.dict()
                    return VaccineOut(id=vaccine_id, **old_data)
        except Exception as e:
            print(e)
            return {"message": "Could not update vacccine"}

    def delete_vaccine(self, id) -> None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM vaccines
                    WHERE id = %s
                    """,
                    [id],
                )
