import os
from .accounts import AccountOut
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


class DonationOut(BaseModel):
    id: int
    item_name: str
    description: Optional[str]
    date: date
    picture: Optional[str]
    category: str
    claimed: bool
    owner: AccountOut


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
            updated_donation = self.get_donation(donation_id)
            return updated_donation
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
            if id is not None:
                return self.get_donation(id)
        except Exception as e:
            print(e)
            return {"message": "Could not create this donation"}

    def get_donations(self) -> List[DonationOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT d.id, d.item_name, d.description, d.date, d.picture, d.category,
                               d.claimed, d.owner_id, a.id AS owner_id, a.first_name, a.last_name,
                               a.username, a.phone, a.zip
                        FROM accounts a
                        JOIN donations d ON(a.id = d.owner_id)

                        """,
                    )
                    donations = []
                    rows = cur.fetchall()
                    for row in rows:
                        donation = self.donation_record_to_dict(
                            row, cur.description
                        )
                        donations.append(donation)
                    return donations

        except Exception as e:
            print(e)
            return {"message": "Could not retreive these donations"}

    def get_donation(self, id) -> DonationOut | None:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                         SELECT d.id, d.item_name, d.description, d.date, d.picture, d.category,
                                d.claimed, d.owner_id,
                                a.id AS owner_id, a.first_name, a.last_name,
                                a.username, a.phone, a.zip
                            FROM donations d
                            JOIN accounts a ON(a.id = d.owner_id)
                            WHERE d.id = %s
                        """,
                        [id],
                    )

                    row = cur.fetchone()
                    return self.donation_record_to_dict(row, cur.description)

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

    def donation_record_to_dict(self, row, description) -> DonationOut | None:
        donation = None
        if row is not None:
            donation = {}
            donation_fields = [
                "id",
                "item_name",
                "description",
                "category",
                "date",
                "picture",
                "claimed",
            ]
            for i, column in enumerate(description):
                if column.name in donation_fields:
                    donation[column.name] = row[i]
            owner = {}
            owner_fields = [
                "owner_id",
                "first_name",
                "last_name",
                "username",
                "phone",
                "zip",
            ]
            for i, column in enumerate(description):
                if column.name in owner_fields:
                    owner[column.name] = row[i]
            owner["id"] = owner["owner_id"]

            donation["owner"] = AccountOut(**owner)
            return DonationOut(**donation)
