from fastapi.testclient import TestClient
from main import app
from queries.donations import DonationQueries
# from routers.authenticator import authenticator

client = TestClient(app)


class EmptyDonationQueries:
    def get_donations(self):
        return []
    

def test_get_all_donations():

    app.dependency_overrides[DonationQueries] = EmptyDonationQueries
    response = client.get("/api/donations")
    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == {"donations":[]}     



# class CreateDonationQueries:
#     def create_donation(self, donation):
#         result = {
#             "id": 7,
#             "owner": {
#                 "first_name": "ka",
#                 "last_name": "le",
#                 "username": "k@mail.com",
#                 "phone": 123123121,
#                 "zip": 91232,
#                 "id": 17
#             },
#             }
#         result.update(donation)
#         return result   
    

# def test_create_donation():

#     app.dependency_overrides[authenticator.get_current_account_data] = CreateDonationQueries

    
#     json = {
#         "item_name": "dinosaur",
#         "description": "stuffy toy",
#         "date": "2023-08-08",
#         "picture": "google.pix.com",
#         "category": "toys",
#         "claimed": False,
#         "owner_id": 17
#     }

#     expected = {
#         "id": 7,
#         "item_name": "dinosaur",
#         "description": "stuffy toy",
#         "date": "2023-08-08",
#         "picture": "google.pix.com",
#         "category": "toys",
#         "claimed": False,
#         "owner": {
#             "first_name": "ka",
#             "last_name": "le",
#             "username": "k@mail.com",
#             "phone": 123123121,
#             "zip": 91232,
#             "id": 17
#         },
#         }
    

#     response = client.post("/api/donations", json=json)

#     app.dependency_overrides = {}

#     assert response.status_code == 200
#     assert response.json() == expected
