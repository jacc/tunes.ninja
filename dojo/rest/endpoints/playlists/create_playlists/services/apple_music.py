

from fastapi import APIRouter
from dojo.shared.response import PredefinedModelResponse, ModelResponse
from dojo.shared.error_codes.common import UnsupportedActionForService

router = APIRouter(prefix="/apple-music")


@router.get("/create")
async def create_apple_music_playlist_under_user():
    return PredefinedModelResponse(
        UnsupportedActionForService, status_code=422
    )

