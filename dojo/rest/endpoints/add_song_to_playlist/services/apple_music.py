from fastapi import APIRouter
from loguru import logger
from dojo.rest.endpoints.add_song_to_playlist.models.request_models import (
    IncomingRequestAddSongToPlaylist,
)
from dojo.shared.error_codes import AppleMusicUnableToAddToPlaylists
from dojo.rest.endpoints.add_song_to_playlist.models.response_models import (
    AddNewSongToPlaylistResponseModel,
)

router = APIRouter(prefix="/apple-music")


@router.post(
    "/add/song/playlist",
    response_model=AddNewSongToPlaylistResponseModel,
    responses={500: {"model": AppleMusicUnableToAddToPlaylists}},
)
async def add_song_to_apple_music_playlist(incoming: IncomingRequestAddSongToPlaylist):
    pass
