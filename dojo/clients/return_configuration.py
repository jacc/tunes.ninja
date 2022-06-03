
from dojo.configuration import Configuration
from functools import lru_cache


@lru_cache(maxsize=None)
def return_configuration():
    return Configuration()