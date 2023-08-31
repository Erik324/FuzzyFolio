from fastapi.testclient import TestClient
from main import app
from queries.vaccines import VaccineQueries
from routers.authenticator import authenticator

client = TestClient(app)

def fake_get_current_account_data():
    return {
        "first_name": "Eva",
        "last_name": "Smith",
        "username": "Eva@gmail.com",
        "phone": 8586421478,
        "zip": 95478,
        "id": 1,
        "hashed_password": "hashed_password_here",
    }

class FakeVaccineQueries(VaccineQueries):
    def get_vaccines(self):
        return []

def test_get_all_vaccines():
    app.dependency_overrides[authenticator.get_current_account_data] = fake_get_current_account_data
    app.dependency_overrides[VaccineQueries] = FakeVaccineQueries
    # Arrange

    # Act
    response = client.get("/api/vaccines")

    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == {"vaccines": []}
