
from functools import lru_cache


import aioredis
from dojo.configuration import Configuration


from loguru import logger

@lru_cache(maxsize=None)
def return_configuration():
    return Configuration()

def return_async_redis():
    return aioredis.Redis(
        return_configuration().DOJO_REDIS_URL
    )