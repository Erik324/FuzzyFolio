import os
from psycopg_pool import ConnectionPool
from typing import List, Optional
from pydantic import BaseModel
from datetime import date


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])

class DonationIn(BaseModel):
    item_name: str
    description: Optional[str]
    date: date
    picture:Optional[str]
    category:str
    claimed:bool
    owner_id: int

class DonationOut(DonationIn):
    id: int

class DonationListOut(BaseModel):
    donations: list[DonationOut]

