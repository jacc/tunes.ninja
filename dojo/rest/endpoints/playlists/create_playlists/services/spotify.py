import arrow
from fastapi import APIRouter, Depends, Query, BackgroundTasks
from loguru import logger
from dojo.background.tasks.create_playlist.spotify import create_playlist_for_user
from dojo.background.tasks.link_playlist.link_playlist_to_channel import (
    link_created_spotify_playlist,
)
from dojo.databases.playlist_database import UserCreatedPlaylists
from dojo.rest.endpoints.playlists.create_playlists.models.responses import (
    PlaylistCreationInformation,
)
from dojo.shared.error_codes.create_playlist_errors import UnableToCreatePlaylistErrorGenericSpotify, UnableToCreatePlaylistUnauthorizedSpotify, UnableToLinkSpotifyPlaylistToDiscordChannel
from dojo.shared.error_messages import ErrorMessage
from dojo.shared.response import (
    BackgroundProcessResponse,
    PredefinedModelResponse,
    ModelResponse,
)
from dojo.clients.mongo_clients import return_odmantic_mongo
from dojo.shared.error_codes.common import UnsupportedActionForService
from dojo.rest.depends.fetch_spotify_client_on_discord_id import (
    fetch_user_spotify_client_from_query_parameter,
)
from dojo.rest.depends.fetch_spotify_client_on_discord_id import (
    fetch_user_spotify_client_from_query_parameter,
)
from pyfy import AsyncSpotify
from pyfy.excs import ApiError, AuthError
import nanoid

router = APIRouter(prefix="/spotify")


@router.post(
    "/create",
    responses={
        200: {"model": PlaylistCreationInformation},
        201: {"model": BackgroundProcessResponse, "description": "Returned if bg=true"},
    },
)
async def create_playlist_under_spotify(
    discord_channel_id: str = Query(alias="discordChannelId"),
    discord_user_id: str = Query(alias="discordId"),
    fetch_discord_information: AsyncSpotify = Depends(
        fetch_user_spotify_client_from_query_parameter
    ),
    background: bool = Query(default=False, alias="bg"),
):

    if background:
        _created_process = create_playlist_for_user.delay(
            discord_user_id=discord_user_id, discord_channel_id=discord_channel_id
        )
        return ModelResponse(
            content=BackgroundProcessResponse(
                background_task_id=_created_process.id, process_name="spotify"
            ),
            status_code=201,
        )

    try:
        created_playlist = await fetch_discord_information.create_playlist(
            name=f"Tunes.ninja Playlist (#{nanoid.generate(size=5)})",
            description="This playlist was created by Tunes.ninja and is being synced to a Discord Channel!",
        )
        await return_odmantic_mongo().save(
            UserCreatedPlaylists(
                service="spotify",
                service_playlist_url=created_playlist["external_urls"]["spotify"],
                linked_to_discord_channel=None,
                service_unique_id=created_playlist["id"],
                last_updated=arrow.utcnow().isoformat(),
                linked_to_discord_user=discord_user_id,
            )
        )
    except ApiError:
        return PredefinedModelResponse(
            UnableToCreatePlaylistErrorGenericSpotify, status_code=400
        ) 
    except AuthError:
        return PredefinedModelResponse(
            UnableToCreatePlaylistUnauthorizedSpotify, status_code=400
        )

    # try:
    #     link_playlist = link_created_spotify_playlist.delay(
    #         discord_user_id=discord_user_id,
    #         playlist_id=created_playlist["id"],
    #         channel_id=discord_channel_id,
    #     )
    # except Exception:
    #     logger.exception("Unable to link playlist to channel")
    #     return PredefinedModelResponse(
    #         content=UnableToLinkSpotifyPlaylistToDiscordChannel, status_code=500
    #     )

    return PlaylistCreationInformation(
        playlist_name=created_playlist["name"],
        playlist_link=created_playlist["external_urls"]["spotify"],
        service="spotify",
    )
