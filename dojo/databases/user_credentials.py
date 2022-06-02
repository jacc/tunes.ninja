

from odmantic import Model
from pydantic import BaseModel
import typing

from .models.spotify_credentials import SpotifyCredentials
from .models.apple_music_credentials import AppleMusicCredentials

class UserServiceCredentials(Model):
    
    discord_user_id: str
    
    spotify_credentials: typing.Optional[SpotifyCredentials] = None
    apple_music_credentials: typing.Optional[AppleMusicCredentials] = None