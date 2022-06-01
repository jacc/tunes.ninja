

from fastapi import APIRouter
from loguru import logger




router = APIRouter(prefix="/control-playback", tags=["Control playback"])

from .play_track.router import router as play_tracks_router
from .pause_playback.router import router as pause_playback_router


routers = [
    play_tracks_router,
    pause_playback_router
]

for router_to_add in routers:
    try:
        router.include_router(router_to_add)
    except Exception:
        logger.exception("Unable to add router")