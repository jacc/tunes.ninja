from dojo.background.tasks.bases.spotify_client import MongoSpotifyClient
from dojo.background.celery_configuration import background
from loguru import logger
import typing

from dojo.databases.playlist_database import UserCreatedPlaylists


if typing.TYPE_CHECKING:
    from pyfy import Spotify
    from pymongo.collection import Collection


@background.task(base=MongoSpotifyClient)
def link_created_spotify_playlist(
    discord_user_id: str,
    playlist_id: str,
    channel_id: str,
):
    _playlist_database = (
        link_created_spotify_playlist.playlist_mongo
    )  # type: Collection

    try:
        # check if the playlist has already been created, but we haven't linked it to a channel yet
        _fetch_playlist_in_db = _playlist_database.find_one(
            {
                "service": "spotify",
                "service_unique_id": playlist_id,
            }
        )
    except Exception:
        logger.exception(
            f"Unable to check if playlist ({playlist_id}) exists in database"
        )
        raise

    try:
        _fetch_credentials_for_user = (
            link_created_spotify_playlist.return_credentials_for_user(
                discord_user_id=discord_user_id, generate_client=True
            )
        )  # type: Spotify

        if not _fetch_credentials_for_user:
            logger.error(
                "Unable to link playlist to channel. No Spotify Credentials are saved this user!"
            )
            raise Exception("No Spotify credentials found for user.")

        _fetch_playlist_information_under_user = _fetch_credentials_for_user.playlist(
            playlist_id=playlist_id
        )
        if _playlist_database.find(
            {
                "service_unique_id": playlist_id,
                "linked_to_discord_user": discord_user_id,
                "service": "spotify",
            }
        ):
            logger.error(
                f"Playlist {playlist_id} is already linked to channel {channel_id} for user {discord_user_id}"
            )
            return
        elif _playlist_database.find(
            {
                "linked_to_discord_channel": channel_id,
                "service": "spotify",
            }
        ):
            logger.error(f"This channel already has a spotify playlist linked to it.")

        _playlist_database.insert_one(
            UserCreatedPlaylists(
                service="spotify",
                service_unique_id=playlist_id,
                linked_to_discord_user=discord_user_id,
                linked_to_discord_channel=channel_id,
                service_playlist_url=_fetch_playlist_information_under_user[
                    "external_urls"
                ]["spotify"],
            )
        )
    except Exception:
        logger.exception("Unable to link playlist to channel.")
        raise
