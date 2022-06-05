

from dojo.shared.error_messages import ErrorMessage
import typing


class UnableToPlayTrackSpotifyUser(ErrorMessage):
    error_code: str = "spt_upt001"
    error_message: typing.Optional[str] = "There was a problem playing the track on this user."

error_codes = [
    UnableToPlayTrackSpotifyUser
]