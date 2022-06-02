
from pydantic import BaseModel
from datetime import datetime

class AppleMusicCredentials(BaseModel):
    personal_access_token: str 
    personal_access_token_expiration: datetime