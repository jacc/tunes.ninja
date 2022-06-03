

from pydantic import BaseModel, HttpUrl


from dojo.shared.supported_services import SupportedServices

class PlaylistCreationInformation(BaseModel):
    service: SupportedServices
    playlist_name: str
    playlist_link: HttpUrl