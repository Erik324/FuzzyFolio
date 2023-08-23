import os
from psycopg_pool import ConnectionPool
from typing import List, Optional
from pydantic import BaseModel
from fastapi import HTTPException

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class AuthenticationException(Exception):
    pass


class AccountIn(BaseModel):
    first_name: str
    last_name: str
    username: str
    phone: Optional[int]
    zip: int


class AccountOut(AccountIn):
    id: int


class AccountListOut(BaseModel):
    accounts: list[AccountOut]


class AccountInWithPassword(AccountIn):
    password: str


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class AccountQueries:
    def get_all_accounts(self) -> List[AccountOut]:
        try:
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
        except Exception as e:
            print(e)
            return {"message": "Could not get all accounts"}

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
                if row is None:
                    raise HTTPException(
                        status_code=404,
                        detail="No user found with id {}".format(id),
                    )
                else:
                    try:
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        return AccountOutWithPassword(**record)
                    except Exception as e:
                        raise Exception("Error:", e)

    def username_check(self, username) -> AccountOutWithPassword:
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
                if row is None:
                    raise HTTPException(
                        status_code=404,
                        detail="No user found with username {}".format(
                            username
                        ),
                    )
                else:
                    try:
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        return AccountOutWithPassword(**record)
                    except Exception as e:
                        raise Exception("Error:", e)

    def update_account(self, id: int, account: AccountIn) -> AccountOut:
        if self.get_account_by_id(id) is None:
            return None
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
