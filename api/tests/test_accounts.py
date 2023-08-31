from pydantic import BaseModel
from fastapi.testclient import TestClient
from main import app
from queries.accounts import AccountQueries
from routers.authenticator import authenticator

client = TestClient(app)

class AccountOutWithPassword(BaseModel):
    first_name: str
    last_name: str
    username: str
    phone: int
    zip: int
    id: int
    hashed_password: str

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

def test_get_account():
    # Arrange
    app.dependency_overrides[authenticator.get_current_account_data] = fake_get_current_account_data
    user_id = 1
    class FakeAccountQueries(AccountQueries):
        def get_account_by_id(self, id):
            return AccountOutWithPassword(
                first_name="Eva",
                last_name="Smith",
                username="Eva@gmail.com",
                phone=8586421478,
                zip=95478,
                id=id,
                hashed_password="password",
            )
    app.dependency_overrides[AccountQueries] = FakeAccountQueries

    # Act
    response = client.get(f"/api/accounts/{user_id}")
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == {
        "first_name": "Eva",
        "last_name": "Smith",
        "username": "Eva@gmail.com",
        "phone": 8586421478,
        "zip": 95478,
        "id": user_id,
    }
