import nanoid
from dojo.background.tasks.bases.spotify_client import MongoSpotifyClient
from dojo.background.celery_configuration import background
from loguru import logger
import typing

from dojo.background.tasks.link_playlist.link_playlist_to_channel import (
    link_created_spotify_playlist,
)


if typing.TYPE_CHECKING:
    from pyfy import Spotify


@background.task(base=MongoSpotifyClient)
def create_playlist_for_user(
    discord_user_id: str,
    discord_channel_id: str,
    playlist_name: str = f"Tunes.ninja Synced Playlist (#{nanoid.generate(size=5)})",
    playlist_description: str = "This playlist was created by Tunes.ninja and is being synced to a Discord Channel!",
):
    _spotify_client = create_playlist_for_user.return_credentials_for_user(
        discord_user_id=discord_user_id
    )  # type: Spotify

    created_playlist = _spotify_client.create_playlist(
        name=f"Tunes.ninja Playlist (#{nanoid.generate(size=4)})",
        description="This playlist was created by Tunes.ninja and is being synced to a Discord Channel!",
    )
    link_created_spotify_playlist(
        discord_user_id=discord_user_id,
        playlist_id=created_playlist["id"],
        channel_id=discord_channel_id,
    )
