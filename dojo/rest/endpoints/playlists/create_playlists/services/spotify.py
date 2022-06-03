from fastapi import APIRouter, Depends, Query, BackgroundTasks
from dojo.shared.response import PredefinedModelResponse, ModelResponse
from dojo.shared.error_codes.common import UnsupportedActionForService
from dojo.rest.depends.fetch_spotify_client_on_discord_id import (
    fetch_user_spotify_client_from_query_parameter,
)
from dojo.rest.depends.fetch_spotify_client_on_discord_id import (
    fetch_user_spotify_client_from_query_parameter,
)
from pyfy import AsyncSpotify

import nanoid

router = APIRouter(prefix="/spotify")


@router.post("/create")
async def create_playlist_under_spotify(
    discord_channel_id: str = Query(alias="discordChannelId"),
    fetch_discord_information: AsyncSpotify = Depends(
        fetch_user_spotify_client_from_query_parameter
    )
):  
    
    return await fetch_discord_information.create_playlist(
        name=f"Tunes.ninja Playlist (#{nanoid.generate(size=4)})",
        description="This playlist was created by Tunes.ninja and is being synced to a Discord Channel!",
    )
