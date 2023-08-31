from fastapi.testclient import TestClient
from main import app
from queries.pets import PetQueries
from routers.authenticator import authenticator
from queries.accounts import AccountOut


client = TestClient(app)


class EmptyPetQueries:
    def get_pets(self):
        return []


def fake_get_current_account_data():
    return dict(
        AccountOut(
            first_name="string",
            last_name="string",
            username="string",
            phone=0,
            zip=0,
            id=5,
        )
    )


def test_get_pets():
    app.dependency_overrides[PetQueries] = EmptyPetQueries
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data

    response = client.get("/api/pets")
    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == {"pets": []}


def test_init():
    assert 1 == 1
