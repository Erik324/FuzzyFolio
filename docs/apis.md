# APIs

# Account

- **Methods**: `POST`, `GET`, `PUT`, `DELETE`
- **Paths**: `/api/accounts`, `/api/accountdata`, `/api/accounts/{user_id}`

In the request body, username is an email and must be unique, and phone is optional.

Request Body:

```json
{
  "first_name": string,
  "last_name": string,
  "username": string,
  "phone": int,
  "zip": int,
  "password": string
}
```

Response Body:

```json
{
  "first_name": string,
  "last_name": string,
  "username": string,
  "phone": int,
  "zip": int,
  "password": string,
  "id": int
}
```

# Pets

- **Methods**: `POST`, `GET`, `PUT`, `DELETE`
- **Paths**: `/api/pets`, `/api/pets/{pet_id}`

Only required field is pet name, all others are optional.

Request Body:

```json
{
  "pet_name": string,
  "picture": string,
  "age": int,
  "species": string,
  "breed": string,
  "color": string,
  "weight": int,
  "disease": string,
  "medication": string,
  "allergy": string,
  "dietary_restriction": string,
  "description": string,
  "owner_id": int
}
```

Response Body:

```json
{
  "pet_name": string,
  "picture": string,
  "age": int,
  "species": string,
  "breed": string,
  "color": string,
  "weight": int,
  "disease": string,
  "medication": string,
  "allergy": string,
  "dietary_restriction": string,
  "description": string,
  "owner_id": int,
  "id": int
}
```

# Vaccines

- **Methods**: `POST`, `GET`, `PUT`, `DELETE`
- **Paths**: `/api/vaccines`, `/api/vaccines/{vaccine_id}`

Required fields are pet_id and vaccine_name, all others are optional.

Request Body:

```json
{
  "vaccine_name": string,
  "clinic": string,
  "received_date": date,
  "due_date": date,
  "pet_id": int
}
```

Response Body:

```json
{
  "vaccine_name": string,
  "clinic": string,
  "received_date": date,
  "due_date": date,
  "pet_id": int,
  "id": int,
}
```

# Donations

- **Methods**: `POST`, `GET`, `PUT`, `DELETE`
- **Paths**: `/api/donations`, `/api/donations/{donation_id}`

Required fields are item_name, date, category, claimed, owner_id. description and picture are optional.

Request Body:

```json
{
  "item_name": string,
  "description": string,
  "date": date,
  "picture": string,
  "category": string,
  "claimed": bool,
  "owner_id": int
}
```

Response Body:

```json
{
  "id": int,
  "item_name": string,
  "description": string,
  "date": date,
  "picture": string,
  "category": string,
  "claimed": bool,
  "owner": {
    "first_name": string,
    "last_name": string,
    "username": string,
    "phone": int,
    "zip": int,
    "id": int
  }
}
```
