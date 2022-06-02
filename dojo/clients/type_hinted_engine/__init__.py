

import typing
import odmantic
from pymongo.collection import Collection


        


class AsyncHintedEngine(odmantic.AIOEngine):    
    def hinted_database(self, collection_required, *args, **kwargs) -> Collection:
        return self.get_collection(collection_required)
    
    
