

from datetime import datetime
from pydantic import BaseModel
from dojo.shared.type_hint_models import enable_init_auto_complete


@enable_init_auto_complete
class SpotifyCredentials(BaseModel):
    access_token: str
    refresh_token: str
    access_token_expiration: datetime
    scopes_provided: str
    spotify_uid: str