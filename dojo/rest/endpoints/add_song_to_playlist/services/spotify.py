from fastapi import APIRouter
from loguru import logger
from dojo.rest.endpoints.add_song_to_playlist.models.request_models import (
    IncomingRequestAddSongToPlaylist,
)
from dojo.shared.error_codes import SpotifyUnableToAddToPlaylists
from dojo.rest.endpoints.add_song_to_playlist.models.response_models import (
    AddNewSongToPlaylistResponseModel,
)

router = APIRouter(prefix="/spotify")


@router.post(
    "/add/song/playlist",
    response_model=AddNewSongToPlaylistResponseModel,
    responses={500: {"model": SpotifyUnableToAddToPlaylists}},
)
async def add_song_to_spotify_playlist(incoming: IncomingRequestAddSongToPlaylist):
    pass
