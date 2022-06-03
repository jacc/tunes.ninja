
from pyfy import AsyncSpotify, Spotify
from pyfy.creds import UserCreds, ClientCreds
from loguru import logger
from .return_configuration import return_configuration

def return_tunesninja_client_creds():
    return ClientCreds(
        client_id=return_configuration().DOJO_SPOTIFY_CLIENT_ID,
        client_secret=return_configuration().DOJO_SPOTIFY_CLIENT_SECRET
    )