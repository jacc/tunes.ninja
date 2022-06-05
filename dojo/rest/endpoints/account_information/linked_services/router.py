from fastapi import APIRouter, Depends

from dojo.rest.depends.fetch_user_credentials_on_discord_id import (
    fetch_discord_id_from_query_parameter,
)
from dojo.databases.user_credentials import UserServiceCredentials
from dojo.rest.endpoints.account_information.linked_services.models.linked_services_changes import ChangedInner, ChangedLinkedServices
from dojo.shared.supported_services import SupportedServices
from dojo.clients.mongo_clients import return_odmantic_mongo
router = "/linked-services"


engine = return_odmantic_mongo()

@router.get("/active")
async def view_active_linked_services_for_user(
    account_information: UserServiceCredentials = Depends(
        fetch_discord_id_from_query_parameter
    ),
):
    return {
        "spotify": account_information.spotify_credentials is not None,
        "appleMusic": account_information.apple_music_credentials is not None,
    }


@router.delete("/delete/{service}", response_model=ChangedLinkedServices)
async def delete_linked_service_for_user(
    service: SupportedServices,
    account_information: UserServiceCredentials = Depends(
        fetch_discord_id_from_query_parameter
    )
):
    if service == SupportedServices.SPOTIFY and account_information.spotify_credentials:
        account_information.spotify_credentials = None
        await engine.save(account_information)
    elif service == SupportedServices.APPLE_MUSIC and account_information.apple_music_credentials:
        account_information.apple_music_credentials = None
        await engine.save(account_information)
    
    
    return ChangedLinkedServices(
        changes=ChangedInner(
            apple_music=account_information.apple_music_credentials is None and service == SupportedServices.APPLE_MUSIC,
            spotify=account_information.spotify_credentials is None and service == SupportedServices.SPOTIFY,
        )
    )



    

