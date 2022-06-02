
from functools import lru_cache
import asyncio

from odmantic import AIOEngine
from pymongo import MongoClient

from dojo.configuration import Configuration
from .type_hinted_engine import AsyncHintedEngine
from motor.motor_asyncio import AsyncIOMotorClient

from loguru import logger

@lru_cache(maxsize=None)
def return_configuration():
    return Configuration()


@lru_cache(maxsize=128)
def return_odmantic_mongo() -> AsyncHintedEngine:
    logger.info(f"Connecting to database: {return_configuration().DOJO_MONGODB_URL}")
    _generated_aio_engine = AsyncHintedEngine(
        motor_client=AsyncIOMotorClient(
            return_configuration().DOJO_MONGODB_URL
        ),
        database=return_configuration().DOJO_MONGODB_DATABASE_NAME
    )

    # this is needed because once we start adding workers,
    # odmantic started to create async loops (despite already being an active one)
    _generated_aio_engine.client.get_io_loop = asyncio.get_running_loop
    return _generated_aio_engine


def return_normal_mongo():
    return MongoClient(
        return_configuration().DOJO_MONGODB_URL
    )[return_configuration().DOJO_MONGODB_DATABASE_NAME]