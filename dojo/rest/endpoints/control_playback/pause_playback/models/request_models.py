

from pydantic import BaseModel, Field
from dojo.shared.supported_services import SupportedServices

class IncomingRequestPausePlayback(BaseModel):
    service: SupportedServices
    song_id: str = Field(..., alias="songId")
