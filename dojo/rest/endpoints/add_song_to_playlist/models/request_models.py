

from pydantic import BaseModel, Field
from dojo.shared.supported_services import SupportedServices

class IncomingRequestAddSongToPlaylist(BaseModel):
    service: SupportedServices
    song_id: str = Field(..., alias="songId")
    target_playlist_id: str = Field(..., alias="targetPlaylistId")
