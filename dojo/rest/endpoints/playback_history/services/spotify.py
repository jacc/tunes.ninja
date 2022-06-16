import arrow
from fastapi import APIRouter, Query, Depends
from pyfy import AsyncSpotify

from dojo.rest.depends.fetch_spotify_client_on_discord_id import (
    fetch_user_spotify_client_from_query_parameter,
    fetch_discord_id_from_query_parameter,
)
from dojo.shared.error_codes.account_related import (
    UnableToFetchCurrentlyPlayingSpotifyTrack,
    UnableToFetchPlaybackHistorySpotify,
)
from dojo.shared.supported_services import SupportedServices
from ..models.response import Track, RecentlyPlayedTracks, ActivelyPlayingTrack
import typing
from loguru import logger

router = APIRouter(prefix="/spotify")


@router.get(
    "/currently-playing",
    responses={
        400: {
            "model": UnableToFetchCurrentlyPlayingSpotifyTrack,
        },
        200: {"model": ActivelyPlayingTrack},
    },
)
async def view_currently_playing_track(
    discord_user_id: str = Query(alias="discordId"),
    spotify_client: "typing.Any" = Depends(
        fetch_user_spotify_client_from_query_parameter
    ),
):
    spotify_client: AsyncSpotify = spotify_client

    try:
        _fetch_currently_playing_track = spotify_client.currently_playing()
        return ActivelyPlayingTrack(
            track=Track(
                title=_fetch_currently_playing_track["name"],
                artist=[x["name"] for x in _fetch_currently_playing_track["artists"]],
                album=_fetch_currently_playing_track["album"]["name"],
                service=SupportedServices.SPOTIFY,
            ),
            timestamp=_fetch_currently_playing_track["timestamp"],
        )
    except Exception:
        logger.exception("Unable to fetch currently playing track from user.")
        pass


@router.get(
    "/historical",
    name="Get the last 10 Songs from a Spotify User's History",
    responses={
        400: {"model": UnableToFetchPlaybackHistorySpotify},
        200: {"model": RecentlyPlayedTracks},
    },
)
async def get_last_ten_songs_from_spotify_account(
    discord_user_id: str = Query(alias="discordId"),
    spotify_client: "typing.Any" = Depends(
        fetch_user_spotify_client_from_query_parameter
    ),
):
    spotify_client: AsyncSpotify = spotify_client
    try:
        _fetch_currently_playing_track = spotify_client.recently_played_tracks(limit=10)
        _tracks_created = [
            ActivelyPlayingTrack(
                track=Track(
                    title=track["name"],
                    artist=[x["name"] for x in track["artists"]],
                    album=track["album"]["name"],
                    service=SupportedServices.SPOTIFY,
                ),
                timestamp=arrow.get(track["played_at"]),
            ) for track in _fetch_currently_playing_track['items']
        ]
        return RecentlyPlayedTracks(
            tracks_played=_tracks_created,
        )
    except Exception:
        logger.exception("Unable to fetch currently historical tracks from user.")
        pass
