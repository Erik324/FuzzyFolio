import os
from psycopg_pool import ConnectionPool
from typing import List, Optional, Union
from pydantic import BaseModel
from datetime import date


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class DonationIn(BaseModel):
    item_name: str
    description: Optional[str]
    date: date
    picture: Optional[str]
    category: str
    claimed: bool
    owner_id: int


class DonationOut(DonationIn):
    id: int


class DonationListOut(BaseModel):
    donations: list[DonationOut]


class Error(BaseModel):
    message: str


class DonationQueries:
    def update_donation(
        self, donation_id: int, donation: DonationIn
    ) -> Union[DonationOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE donations
                        SET item_name = %s,
                            description = %s,
                            date = %s,
                            picture = %s,
                            category = %s,
                            claimed = %s,
                            owner_id = %s
                        WHERE id = %s
                        """,
                        [
                            donation.item_name,
                            donation.description,
                            donation.date,
                            donation.picture,
                            donation.category,
                            donation.claimed,
                            donation.owner_id,
                            donation_id,
                        ],
                    )
                    old_data = donation.dict()
                    return DonationOut(id=donation_id, **old_data)
        except Exception as e:
            print(e)
            return {"message": "Could not update this donation"}

    def create_donation(self, donation) -> DonationOut | None:
        try:
            id = None
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                            INSERT INTO donations (
                            item_name, description, date, picture, category, claimed, owner_id
                            )
                            VALUES(%s, %s, %s, %s, %s, %s, %s)
                            RETURNING id
                            """,
                        [
                            donation.item_name,
                            donation.description,
                            donation.date,
                            donation.picture,
                            donation.category,
                            donation.claimed,
                            donation.owner_id,
                        ],
                    )

                    row = cur.fetchone()
                    id = row[0]
                    old_data = donation.dict()
                    if id is not None:
                        return DonationOut(id=id, **old_data)
        except Exception as e:
            print(e)
            return {"message": "Could not create this donation"}

    def get_donations(self) -> List[DonationOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT *
                        FROM donations
                        ORDER BY owner_id
                        """,
                    )

                    results = []
                    for row in cur.fetchall():
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        results.append(DonationOut(**record))

                    return results
        except Exception as e:
            print(e)
            return {"message": "Could not retreive these donations"}

    def get_donation(self, id) -> DonationOut | None:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT *
                        FROM donations
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

                        return DonationOut(**record)
        except Exception as e:
            print(e)
            return {"message": "Could not get this donation"}

    def delete_donation(self, id) -> None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM donations
                    WHERE id = %s
                    """,
                    [id],
                )
