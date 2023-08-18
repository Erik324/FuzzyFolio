from fastapi import APIRouter, Depends, Response, HTTPException
from pydantic import BaseModel
from typing import Optional
from queries.vaccines import VaccineIn, VaccineOut, VaccineListOut

router = APIRouter()
