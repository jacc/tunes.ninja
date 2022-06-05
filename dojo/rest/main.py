import typing
import fastapi
from loguru import logger

from dojo.shared.error_codes.common import ServiceLevelError
from dojo.configuration import DEVELOPER_MODE


application = fastapi.FastAPI()


from .endpoints.add_song_to_playlist.router import router as add_song_to_playlist_router
from .endpoints.control_playback.router import router as control_playback_router
from .endpoints.playlists.router import router as playlists_router
from .endpoints.control_playback.router import router as control_playback_router




from dojo.shared.response import (
    APIErrorRaw,
    PredefinedModelResponse,
    PreinitErrorMessage,
    ModelErrorMessage
)

routers = [add_song_to_playlist_router, control_playback_router, playlists_router]


if DEVELOPER_MODE:
    from .endpoints.dev.router import router as dev_router
    routers.append(dev_router)


for router in routers:
    application.include_router(router)


@application.exception_handler(ModelErrorMessage)
@application.exception_handler(PreinitErrorMessage)
async def handle_exception_with_pydantic(
    request: fastapi.Request,
    exc: typing.Union[ModelErrorMessage, PreinitErrorMessage],
):
    return fastapi.Response(
        content=exc.model,
        status_code=exc.status_code,
        media_type="application/json",
    )


@application.exception_handler(fastapi.HTTPException)
async def handle_http_exception(request: fastapi.Request, exc: fastapi.HTTPException):
    return PredefinedModelResponse(content=ServiceLevelError, status_code=500)
