from fastapi import APIRouter, Depends
from pydantic import BaseModel
from dojo.rest.endpoints.playlists.view_playlists.models.responses import (
    PlaylistsForUser,
    Playlist,
)
from dojo.shared.response import PredefinedModelResponse, ModelResponse
from dojo.shared.error_codes.common import UnsupportedActionForService
from dojo.rest.depends.fetch_spotify_client_on_discord_id import (
    fetch_user_spotify_client_from_query_parameter,
)
from pyfy import AsyncSpotify

router = APIRouter(prefix="/spotify")


@router.get("/view", response_model=PlaylistsForUser)
async def view_playlist_under_spotify(
    fetch_discord_information: AsyncSpotify = Depends(
        fetch_user_spotify_client_from_query_parameter
    ),
):
    _fetch_playlists = await fetch_discord_information.user_playlists(limit=10)
    return PlaylistsForUser(
        playlists=[
            Playlist(
                playlist_name=x["name"],
                playlist_service="spotify",
                playlist_url=x["external_urls"]["spotify"],
            )
            for x in _fetch_playlists["items"]
        ]
    )
