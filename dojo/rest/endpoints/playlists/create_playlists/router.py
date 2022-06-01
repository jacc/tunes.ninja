

from .services.apple_music import router as apple_music_router
from .services.spotify import router as spotify_router
from fastapi import APIRouter

router = APIRouter(tags=["Create playlists"])

router.include_router(apple_music_router)
router.include_router(spotify_router)