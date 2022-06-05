


from pydantic import BaseModel



class ChangedInner(BaseModel):
    spotify: bool
    apple_music: bool
class ChangedLinkedServices(BaseModel):
    changes: ChangedInner