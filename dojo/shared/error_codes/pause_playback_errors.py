
from dojo.shared.error_messages import ErrorMessage
import typing

class UnableToPausePlaybackSpotify(ErrorMessage):
    error_code: str = "spo_002"
    error_message: typing.Optional[str] = "Unable to pause playback on Spotify."

class UnableToPausePlaybackAppleMusic(ErrorMessage):
    error_code: str = "apl_002"
    error_message: typing.Optional[str] = "Unable to pause playback on Apple Music."