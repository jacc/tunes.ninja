

from datetime import datetime
from pydantic import BaseModel


class SpotifyCredentials(BaseModel):
    access_token: str
    refresh_token: str
    access_token_expiration: datetime
    scopes_provided: str
    spotify_uid: str