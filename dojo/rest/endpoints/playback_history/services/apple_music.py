import arrow
from fastapi import APIRouter, Query, Depends
from pyfy import AsyncSpotify

from dojo.rest.depends.fetch_spotify_client_on_discord_id import (
    fetch_user_spotify_client_from_query_parameter,
    fetch_discord_id_from_query_parameter,
)
from dojo.shared.error_codes.account_related import (
    UnableToFetchCurrentlyPlayingSpotifyTrack,
    UnableToFetchPlaybackHistorySpotify,
)
from dojo.shared.response import PredefinedModelResponse
from dojo.shared.supported_services import SupportedServices
from dojo.shared.error_codes.common import UnsupportedActionForService
from ..models.response import Track, RecentlyPlayedTracks, ActivelyPlayingTrack
import typing
from loguru import logger

router = APIRouter(prefix="/apple-music")


@router.get(
    "/currently-playing",
    response_model=UnsupportedActionForService
)
async def view_currently_playing_track():
    return PredefinedModelResponse(
        UnsupportedActionForService, status_code=422
    )

@router.get(
    "/historical",
    name="Get the last 10 Songs from a Apple Music User's History",
    responses={
        400: {"model": UnableToFetchPlaybackHistorySpotify},
        200: {"model": RecentlyPlayedTracks},
    },
)
async def get_last_ten_songs_from_spotify_account(
    discord_user_id: str = Query(alias="discordId"),
):
    return PredefinedModelResponse(
        UnsupportedActionForService, status_code=422
    )
