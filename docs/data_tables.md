# Data Tables

## My Account

| id  | first_name | last_name | username   | hashed_password                                                               | phone         | zip |
| --- | ---------- | --------- | ---------- | ----------------------------------------------------------------------------- | ------------- | --- |
| int | str        | str       | str(email) | $2b$12$k1NHbkK2Pg7hzFxym/Cz.eoj5bckf5BlJhb0zE5mkeR3G2KXsVjfS (auto generated) | int(optional) | int |

## My Pets

| id  | pet_name | picture       | age           | species       | breed         | color         | weight        | disease       | medication    | allergy       | dietary_restriction | description   | owner_id |
| --- | -------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------------- | ------------- | -------- |
| int | str      | str(optional) | int(optional) | str(optional) | str(optional) | str(optional) | int(optional) | str(optional) | str(optional) | str(optional) | str(optional)       | str(optional) | int      |

## My Pet's Vaccines

| id  | pet_id | vaccine_name | clinic        | received_date  | due_date       |
| --- | ------ | ------------ | ------------- | -------------- | -------------- |
| int | int    | str          | str(optional) | date(optional) | date(optional) |

## Donation List

| id  | item_name | description   | date | picture       | category | claimed | owner_id |
| --- | --------- | ------------- | ---- | ------------- | -------- | ------- | -------- |
| int | str       | str(optional) | date | str(optional) | str      | bool    | int      |

## My Donations

| id  | item_name | description   | date | picture       | category | claimed | owner_id |
| --- | --------- | ------------- | ---- | ------------- | -------- | ------- | -------- |
| int | str       | str(optional) | date | str(optional) | str      | bool    | int      |
