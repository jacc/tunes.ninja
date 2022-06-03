import typing
import arrow
from celery import Task

from dojo.clients.spotify import return_tunesninja_client_creds
from dojo.clients.mongo_clients import return_normal_mongo
from dojo.databases.models.spotify_credentials import SpotifyCredentials
from dojo.databases.user_credentials import UserServiceCredentials
from loguru import logger
from dojo.databases.playlist_database import UserCreatedPlaylists

from pyfy import Spotify, UserCreds


class MongoSpotifyClient(Task):
    _spotify_client_creds = None
    _mongo_connection = None

    @property
    def mongo(self):
        if self._mongo_connection is None:
            self._mongo_connection = return_normal_mongo()
        return self._mongo_connection

    @property
    def spotify_client_creds(self):
        if self._spotify_client_creds is None:
            self._spotify_client_creds = return_tunesninja_client_creds()
        return self._spotify_client_creds


    @property
    def playlist_mongo(self):
        if self._mongo_connection is None:
            self._mongo_connection = return_normal_mongo()
        return self._mongo_connection[UserCreatedPlaylists.__collection__]

    def return_credentials_for_user(
        self, discord_user_id: str = None, generate_client: bool = False
    ) -> typing.Union[SpotifyCredentials, Spotify]:
        try:
            _fetch_user_credentials = self.mongo[
                UserServiceCredentials.__collection__
            ].find_one(
                {
                    "discord_user_id": discord_user_id,
                }
            )
            if _fetch_user_credentials:
                _creds = SpotifyCredentials(
                    **_fetch_user_credentials["spotify_credentials"]
                )
                if generate_client:

                    # if arrow.now().datetime > _creds.expiration_date:
                    #     logger.warning(
                    #         "User's Spotify credentials have expired. Generating new credentials."
                    #     )
                    #     # TODO: Automatically Save Refreshed token in DB
                    #     pass

                    return Spotify(
                        client_creds=self.spotify_client_creds,
                        user_creds=UserCreds(
                            access_token=_creds.access_token,
                            refresh_token=_creds.refresh_token,
                            expiry=_creds.access_token_expiration,
                        ),
                    )
                else:
                    return _creds

            return None
        except Exception:
            logger.exception(
                "Unable to fetch credentials for user: {}".format(discord_user_id)
            )
