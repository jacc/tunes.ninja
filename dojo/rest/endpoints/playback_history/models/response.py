import typing

from pydantic import BaseModel
from pydantic import HttpUrl
from dojo.shared.supported_services import SupportedServices
from dojo.databases.types.arrow_string import ArrowTime
from dojo.shared.type_hint_models import enable_init_auto_complete

@enable_init_auto_complete
class Track(BaseModel):
    title: str
    artist: typing.List[str]
    album: str
    album_artwork: HttpUrl
    service: SupportedServices

@enable_init_auto_complete
class ActivelyPlayingTrack(BaseModel):
    track: Track
    timestamp: ArrowTime

@enable_init_auto_complete
class RecentlyPlayedTracks(BaseModel):
    tracks_played: typing.List[ActivelyPlayingTrack]
