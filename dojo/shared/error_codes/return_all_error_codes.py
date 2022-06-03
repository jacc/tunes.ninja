from dojo.shared.error_codes import common
from dojo.shared.error_codes import add_to_playlist_errors
from dojo.shared.error_codes import pause_playback_errors
from dojo.shared.error_codes import create_playlist_errors

error_codes = [
    *add_to_playlist_errors.error_codes,
    *common.error_codes,
    *pause_playback_errors.error_codes,
    *create_playlist_errors.error_codes,
]
