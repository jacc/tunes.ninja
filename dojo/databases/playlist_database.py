
from datetime import datetime
from odmantic import Model
from dojo.shared.supported_services import SupportedServices
import typing

class UserCreatedPlaylists(Model):
    
    service: SupportedServices
    service_unique_id: str
    linked_to_discord_user: str
    last_updated: datetime
    
    automatic_sync_channel_id: typing.Optional[str] = None