

from dojo.shared.error_messages import ErrorMessage


class AppleMusicUnableToAddToPlaylists(ErrorMessage):
    error_code = "apl_001"
    error_message = "Unable to add song to Apple Music playlists"

class SpotifyUnableToAddToPlaylists(ErrorMessage):
    error_code = "spo_001"
    error_message = "Unable to add song to Spotify playlist."