import os
from psycopg_pool import ConnectionPool
from typing import List, Optional
from pydantic import BaseModel
from datetime import date


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])

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
