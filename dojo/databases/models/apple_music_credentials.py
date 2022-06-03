
from pydantic import BaseModel
from datetime import datetime
from dojo.shared.type_hint_models import enable_init_auto_complete


@enable_init_auto_complete
class AppleMusicCredentials(BaseModel):
    personal_access_token: str 
    personal_access_token_expiration: datetime