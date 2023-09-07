from fastapi.testclient import TestClient
from main import app
from queries.accounts import AccountOut
from queries.pets import PetQueries, PetOut
from routers.authenticator import authenticator

client = TestClient(app)


class EmptyPetQueries:
    def get_pet(self, id):
        return PetOut(
            pet_name="string",
            picture="string",
            age=0,
            species="string",
            breed="string",
            color="string",
            weight=0,
            disease="string",
            medication="string",
            allergy="string",
            dietary_restriction="string",
            description="string",
            owner_id=0,
            id=0,
        )


def fake_get_current_account_data():
    return dict(
        AccountOut(
            first_name="string",
            last_name="string",
            username="string",
            phone=0,
            zip=0,
            id=0,
        )
    )


def test_get_pet():
    app.dependency_overrides[PetQueries] = EmptyPetQueries
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data

    expected = {
        "pet_name": "string",
        "picture": "string",
        "age": 0,
        "species": "string",
        "breed": "string",
        "color": "string",
        "weight": 0,
        "disease": "string",
        "medication": "string",
        "allergy": "string",
        "dietary_restriction": "string",
        "description": "string",
        "owner_id": 0,
        "id": 0,
    }

    response = client.get("/api/pets/0")

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected
