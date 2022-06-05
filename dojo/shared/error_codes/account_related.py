
from dojo.shared.error_messages import ErrorMessage
import typing


class NoServicesLinked(ErrorMessage):
    error_code: str = "glbl_un001"
    error_message: typing.Optional[str] = "No services are linked to this account."

class SpotifyAccountNotLinked(ErrorMessage):
    error_code: str = "spt_unl001"
    error_message: typing.Optional[str] = "This user does not have a Spotify account linked."
    
class AppleMusicAccountNotLinked(ErrorMessage):
    error_code: str = "apl_unl001"
    error_message: typing.Optional[str] = "This user does not have an Apple Music account linked."
    
    
error_codes = [
    NoServicesLinked,
    SpotifyAccountNotLinked,
]