
import fastapi
from loguru import logger


application = fastapi.FastAPI()



from .endpoints.add_song_to_playlist.router import router as add_song_to_playlist_router
from .endpoints.control_playback.router import router as control_playback_router
from .endpoints.playlists.router import router as playlists_router


routers = [
    add_song_to_playlist_router,
    control_playback_router,
    playlists_router
]


for router in routers:
    application.include_router(router)