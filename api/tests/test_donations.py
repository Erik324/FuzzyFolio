from fastapi.testclient import TestClient
from main import app
from queries.donations import DonationQueries


client = TestClient(app)


class EmptyDonationQueries:
    def get_donations(self):
        return []


def test_get_all_donations():
    app.dependency_overrides[DonationQueries] = EmptyDonationQueries
    response = client.get("/api/donations")
    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == {"donations": []}
