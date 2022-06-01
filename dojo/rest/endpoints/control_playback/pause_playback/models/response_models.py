
from pydantic import BaseModel
from dojo.shared.statuses import Status
from dojo.shared.supported_services import SupportedServices

class PausedPlaybackAction(BaseModel):
    status: Status
    service: SupportedServices