from fastapi import Depends, HTTPException
from .fetch_user_credentials_on_discord_id import (
    fetch_discord_id_from_incoming_body,
    fetch_discord_id_from_path_parameter,
    fetch_discord_id_from_query_parameter,
)


from dojo.clients.spotify import return_tunesninja_client_creds, return_configuration
from dojo.databases.user_credentials import UserServiceCredentials
from pyfy import AsyncSpotify, UserCreds



async def main_generator(user_creds: UserServiceCredentials):
    if user_creds is None:
        return False
    
    return AsyncSpotify(
            client_creds=return_tunesninja_client_creds(),
            user_creds=UserCreds(
                access_token=user_creds.spotify_credentials.access_token,
                refresh_token=user_creds.spotify_credentials.refresh_token,
            ),
        )    

async def fetch_user_spotify_client_from_incoming_body(
    incoming: UserServiceCredentials = Depends(fetch_discord_id_from_incoming_body),
):
    return await main_generator(incoming)

async def fetch_user_spotify_client_from_path_parameter(
    incoming: UserServiceCredentials = Depends(fetch_discord_id_from_path_parameter),
):
    return await main_generator(incoming)

async def fetch_user_spotify_client_from_query_parameter(
    incoming: UserServiceCredentials = Depends(fetch_discord_id_from_query_parameter),
):
    return await main_generator(incoming)