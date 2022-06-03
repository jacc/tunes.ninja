

from pydantic import BaseSettings
from loguru import logger
import pathlib

DEVELOPER_MODE = pathlib.Path(".dojo-dev-mode").exists()

if DEVELOPER_MODE:
    logger.warning("🚧 Developer mode is enabled")

class Configuration(BaseSettings):
    
    
    DOJO_MONGODB_URL: str
    DOJO_MONGODB_DATABASE_NAME: str
    DOJO_REDIS_URL: str
    DOJO_CELERY_REDIS_BROKER_URL: str
    DOJO_CELERY_REDIS_RESULTS_URL: str
    
    DOJO_SPOTIFY_CLIENT_ID: str
    DOJO_SPOTIFY_CLIENT_SECRET: str
    
    class Config:
        env_file = ".env.prod" if not DEVELOPER_MODE else ".env.dev"