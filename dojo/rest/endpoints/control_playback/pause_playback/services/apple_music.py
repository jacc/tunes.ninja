from fastapi import APIRouter
from loguru import logger
from dojo.rest.endpoints.add_song_to_playlist.models.request_models import (
    IncomingRequestAddSongToPlaylist,
)
from dojo.shared.error_codes import AppleMusicUnableToAddToPlaylists
from dojo.shared.error_codes.common import UnsupportedActionForService
from dojo.shared.error_codes.pause_playback_errors import UnableToPausePlaybackAppleMusic
from dojo.shared.statuses import Status
from ..models.response_models import PausedPlaybackAction
from dojo.shared.response import ModelResponse, PredefinedModelResponse

router = APIRouter(prefix="/apple-music")


@router.post(
    "/pause",
    response_model=PausedPlaybackAction,
    responses={422: {"model": UnsupportedActionForService}},
)
async def pause_playback_for_apple_music(incoming: IncomingRequestAddSongToPlaylist):
    return PredefinedModelResponse(
        UnsupportedActionForService, status_code=422
    )
