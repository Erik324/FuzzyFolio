from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional

from queries.pets import PetIn, PetListOut, PetOut, PetQueries
from psycopg.errors import UniqueViolation

router = APIRouter()