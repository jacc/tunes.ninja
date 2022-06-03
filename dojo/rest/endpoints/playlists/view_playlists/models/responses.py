


import typing
from pydantic import BaseModel, HttpUrl
from dojo.shared.supported_services import SupportedServices




class Playlist(BaseModel):
    playlist_name: str
    playlist_url: HttpUrl
    playlist_service: SupportedServices

class PlaylistsForUser(BaseModel):
    playlists: typing.List[Playlist]
    