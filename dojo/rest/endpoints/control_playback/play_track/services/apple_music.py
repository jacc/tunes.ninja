

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from dojo.shared.response import ModelResponse, PredefinedModelResponse
from dojo.shared.error_codes import AppleMusicUnableToAddToPlaylists
from dojo.shared.error_codes.common import UnsupportedActionForService


router = APIRouter(prefix="/apple-music")

@router.get("/play/track/now", response_model=UnsupportedActionForService)
async def play_track_now_on_apple_music():
    return PredefinedModelResponse(
        UnsupportedActionForService, status_code=422
    )

@router.get("/play/track/queue", response_model=UnsupportedActionForService, status_code=400)
async def play_track_on_apple_music_queue():
    return PredefinedModelResponse(
        UnsupportedActionForService, status_code=422
    )