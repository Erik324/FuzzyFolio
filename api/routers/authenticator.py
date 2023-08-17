import os
from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from queries.accounts import AccountQueries,AccountOutWithPassword


class MyAuthenticator(Authenticator):
    async def get_account_data(
        self,
        username: str,
        accounts: AccountQueries,
    ):

        return accounts.get_account_by_username(username)

    def get_account_getter(
        self,
        accounts: AccountQueries = Depends(),
    ):
        return accounts

    def get_hashed_password(self, account: AccountOutWithPassword):
        # Return the encrypted password value from your account object
        return account.hashed_password

    def get_account_data_for_cookie(self, account: AccountOutWithPassword):
        # Return the username and the data for the cookie.
        # You must return TWO values from this method.
        return account.username, AccountOutWithPassword(**account.dict())


authenticator = MyAuthenticator(os.environ["SIGNING_KEY"])
