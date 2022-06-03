from dojo.shared.error_messages import ErrorMessage
import typing


class UnableToCreatePlaylistErrorGenericSpotify(ErrorMessage):
    error_code = "spcu_001"
    error_message = "There was a problem with Spotify when creating this playlist."
    
class UnableToCreatePlaylistUnauthorizedSpotify(ErrorMessage):
    error_code = "spcu_002"
    error_message = "Spotify has responded that you do not have permission to create this playlist."
    
class UnableToCreatePlaylistErrorGenericAppleMusic(ErrorMessage):
    error_code = "amcu_001"
    error_message = "There was a problem with Apple Music when creating this playlist."


class UnableToCreatePlaylistUnauthorizedAppleMusic(ErrorMessage):
    error_code = "amcu_002"
    error_message = "Apple Music has responded that you do not have permission to create this playlist."
    
    
class UnableToLinkSpotifyPlaylistToDiscordChannel(ErrorMessage):
    error_code: str = "spld_001"
    error_message: typing.Optional[str] = "There was a problem linking this playlist to the Discord Channel."

class UnableToLinkAppleMusicPlaylistToDiscordChannel(ErrorMessage):
    error_code: str = "amld_001"
    error_message: typing.Optional[str] = "There was a problem linking this playlist to the Discord Channel."
    

error_codes = [
    UnableToCreatePlaylistErrorGenericSpotify,
    UnableToCreatePlaylistUnauthorizedSpotify,
    UnableToCreatePlaylistErrorGenericAppleMusic,
    UnableToCreatePlaylistUnauthorizedAppleMusic,
    UnableToLinkSpotifyPlaylistToDiscordChannel,
    UnableToLinkAppleMusicPlaylistToDiscordChannel
]