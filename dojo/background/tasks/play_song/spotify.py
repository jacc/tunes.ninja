
from dojo.background.tasks.bases.spotify_client import MongoSpotifyClient
from dojo.background.celery_configuration import background
from loguru import logger
import typing


if typing.TYPE_CHECKING:
    from pyfy import Spotify

@background.task(base=MongoSpotifyClient)
def play_song_under_spotify_account(discord_id: str, spotify_track_id: str):
    
    _create_client = play_song_under_spotify_account.return_credentials_for_user(
        discord_user_id=discord_id, generate_client=True
    ) # type: Spotify
    
    try:
        _create_client.play(spotify_track_id)
        logger.debug(f"Playing song {spotify_track_id} under Spotify account for discord user: {discord_id}.")
    except Exception as e:
        logger.exception("Unable to play song under Spotify account.")
        
@background.task(base=MongoSpotifyClient)
def pause_song_under_spotify_account(discord_id: str):
    
    _create_client = pause_song_under_spotify_account.return_credentials_for_user(
        discord_user_id=discord_id, generate_client=True
    ) # type: Spotify
    
    if not _create_client:
        logger.error(f"No client generated for discord id: {discord_id}")
    
    try:
        _create_client.pause()
        logger.debug(f"Pausing song under Spotify account for discord user: {discord_id}.")
    except Exception as e:
        logger.exception("Unable to pause song under Spotify account.")