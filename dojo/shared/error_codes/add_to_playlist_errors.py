

from dojo.shared.error_messages import ErrorMessage


class AppleMusicUnableToAddToPlaylists(ErrorMessage):
    error_code = "apl_001"
    error_message = "Unable to add song to Apple Music playlists"

class SpotifyUnableToAddToPlaylists(ErrorMessage):
    error_code = "spo_001"
    error_message = "Unable to add song to Spotify playlist."

class AppleMusicUnauthorizedUnableToAddToPlaylists(ErrorMessage):
    error_code = "apl_002"
    error_message = "This user is not authorized to add songs to Apple Music playlists"

class SpotifyUnauthorizedUnableToAddToPlaylists(ErrorMessage):
    error_code = "spo_002"
    error_message = "This user is not authorized to add songs to Spotify playlists."
    
    
error_codes = [
    AppleMusicUnableToAddToPlaylists, SpotifyUnableToAddToPlaylists
]