

from celery import Celery
from dojo.configuration import Configuration


configuration = Configuration()

background = Celery(
    "worker", backend=configuration.DOJO_CELERY_REDIS_RESULTS_URL, broker=configuration.DOJO_CELERY_REDIS_BROKER_URL, include=[]
)