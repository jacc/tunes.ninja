

from pydantic import BaseSettings


class Configuration(BaseSettings):
    
    
    DOJO_MONGODB_URL: str
    DOJO_MONGODB_DATABASE_NAME: str
    DOJO_REDIS_URL: str

    
    class Config:
        env_file = ".env.prod"