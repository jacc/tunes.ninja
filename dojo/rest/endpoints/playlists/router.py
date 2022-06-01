
from fastapi import APIRouter


router = APIRouter(tags=["Playlists"], prefix="/playlists")


from .create_playlists.router import router as create_playlists_router
from .view_playlists.router import router as view_playlists_router
from .unlink_playlist.router import router as unlink_playlist_router
from .link_playlist.router import router as link_playlist_router

router.include_router(create_playlists_router)
router.include_router(view_playlists_router)
router.include_router(unlink_playlist_router)
router.include_router(link_playlist_router)