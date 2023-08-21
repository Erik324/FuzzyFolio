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
    def update_donation(self, donation_id: int, donation: DonationIn) -> Union[DonationOut, Error]:
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
                            donation_id
                        ],
                    )
                    old_data = donation.dict()
                    return DonationOut(id=donation_id, **old_data)
        except Exception as e:
            print(e)
            return {"message": "Could not update this donation"}
