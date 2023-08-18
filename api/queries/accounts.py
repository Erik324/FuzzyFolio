import os
from psycopg_pool import ConnectionPool
from typing import List, Literal, Optional
from pydantic import BaseModel

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class DuplicateAccountError(ValueError):
    pass


class AccountOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    phone: Optional[str]
    zip: str
    # hashed_password: str


class AccountListOut(BaseModel):
    accounts: list[AccountOut]


class AccountIn(BaseModel):
    first_name: str
    last_name: str
    username: str
    phone: Optional[str]
    zip: str


class AccountInWithPassword(AccountIn):
    password: str


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class AccountQueries:
    def get_all_accounts(self) -> List[AccountOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM accounts
                    ORDER BY last_name, first_name
                """
                )

                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(AccountOut(**record))

                return results

    def get_account_by_id(self, id) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM accounts
                    WHERE id = %s
                """,
                    [id],
                )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]

                    return AccountOutWithPassword(**record)

    def get_account_by_username(self, username) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT *
                    FROM accounts
                    WHERE username = %s
                """,
                    [username],
                )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]

                    return AccountOutWithPassword(**record)

    def update_account(self, id: int, account: AccountIn) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE accounts
                    SET
                    first_name = %s,
                    last_name = %s,
                    username = %s,
                    phone = %s,
                    zip = %s
                    WHERE id = %s ;
                """,
                    [
                        account.first_name,
                        account.last_name,
                        account.username,
                        account.phone,
                        account.zip,
                        id,
                    ],
                )
                print("it works")
                old_data = account.dict()
                return AccountOut(id=id, **old_data)

    def create_account(self, data, hashed_password) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                params = [
                    data.first_name,
                    data.last_name,
                    data.username,
                    data.phone,
                    data.zip,
                    hashed_password,
                ]
                cur.execute(
                    """
                    INSERT INTO accounts (first_name, last_name,username, phone, zip, hashed_password)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, first_name, last_name, username, phone, zip, hashed_password
                    """,
                    params,
                )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]

                return AccountOutWithPassword(**record)

    def delete_account(self, user_id) -> None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM accounts
                    WHERE id = %s
                    """,
                    [user_id],
                )
