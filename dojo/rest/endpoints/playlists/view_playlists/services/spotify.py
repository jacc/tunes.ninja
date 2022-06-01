

from fastapi import APIRouter
from dojo.shared.response import PredefinedModelResponse, ModelResponse
from dojo.shared.error_codes.common import UnsupportedActionForService
router = APIRouter(prefix="/spotify")


@router.get("/view")
async def view_playlist_under_spotify():
    return PredefinedModelResponse(
        UnsupportedActionForService, status_code=422
    )

