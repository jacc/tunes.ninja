import queue
from tkinter import E
from fastapi import APIRouter, Depends, Query
from dojo.background.tasks.play_song.spotify import play_song_under_spotify_account
from dojo.shared.error_codes.play_track_errors import UnableToPlayTrackSpotifyUser
from dojo.shared.error_messages import ErrorMessage
from dojo.shared.response import (
    ActionCompleted,
    BackgroundProcessResponse,
    ModelResponse,
    PredefinedModelResponse,
)
from dojo.shared.error_codes import AppleMusicUnableToAddToPlaylists
from dojo.shared.error_codes.common import UnsupportedActionForService


from dojo.rest.depends.fetch_spotify_client_on_discord_id import (
    fetch_user_spotify_client_from_query_parameter,
    fetch_discord_id_from_query_parameter,
)
import typing

from dojo.shared.supported_services import SupportedServices

if typing.TYPE_CHECKING:
    from pyfy import Spotify, AsyncSpotify

router = APIRouter(prefix="/spotify")


@router.put(
    "/play/track/now",
    responses={
        200: {"model": ActionCompleted},
        201: {"model": BackgroundProcessResponse},
        400: {"model": ErrorMessage},
    },
)
async def play_track_now_on_spotify(
    discord_user_id: str = Query(alias="discordId"),
    spotify_client: "typing.Any" = Depends(
        fetch_user_spotify_client_from_query_parameter
    ),
    track_id: str = Query(alias="trackId"),
    background: str = Query(default=False, alias="bg"),
):
    if spotify_client is None:
        return PredefinedModelResponse(UnableToPlayTrackSpotifyUser, status_code=400)

    spotify_client: "AsyncSpotify" = spotify_client

    if background:
        return BackgroundProcessResponse(
            uid=play_song_under_spotify_account.delay(
                discord_id=discord_user_id, spotify_track_id=track_id
            ).id,
            process_name="play_track_now_on_spotify",
        )
    else:
        try:
            _try_to_play = await spotify_client.play(track_id=track_id)
            return ActionCompleted(
                service=SupportedServices.SPOTIFY, action="play_track_now_on_spotify"
            )
        except Exception:
            return PredefinedModelResponse(
                content=UnableToPlayTrackSpotifyUser, status_code=400
            )


@router.put(
    "/play/track/queue",
    responses={
        200: {"model": ActionCompleted},
        201: {"model": BackgroundProcessResponse},
        400: {"model": ErrorMessage},
    },
)
async def play_track_on_spotify_queue(
    discord_user_id: str = Query(alias="discordId"),
    spotify_client: "typing.Any" = Depends(
        fetch_user_spotify_client_from_query_parameter
    ),
    track_id: str = Query(alias="trackId"),
    background: str = Query(default=False, alias="bg"),
):
    if spotify_client is None:
        return PredefinedModelResponse(UnableToPlayTrackSpotifyUser, status_code=400)

    spotify_client: "AsyncSpotify" = spotify_client
    if background:
        return BackgroundProcessResponse(
            uid=play_song_under_spotify_account.delay(
                discord_id=discord_user_id, spotify_track_id=track_id, queue=True
            ).id,
            process_name="queue_track_now_on_spotify",
        )
    else:
        try:
            _try_to_play = await spotify_client.queue(track_id=track_id)
            return ActionCompleted(
                service=SupportedServices.SPOTIFY, action="queue_track_now_on_spotify"
            )
        except Exception:
            return PredefinedModelResponse(
                content=UnableToPlayTrackSpotifyUser, status_code=400
            )
