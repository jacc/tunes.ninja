
from datetime import datetime
from odmantic import Model
from pydantic import HttpUrl
from dojo.shared.supported_services import SupportedServices
import typing
from dojo.shared.type_hint_models import enable_init_auto_complete


@enable_init_auto_complete
class UserCreatedPlaylists(Model):
    
    service: SupportedServices
    service_unique_id: str
    linked_to_discord_user: str
    last_updated: str
    linked_to_discord_channel: typing.Optional[str] = None
    service_playlist_url: typing.Optional[HttpUrl] = None