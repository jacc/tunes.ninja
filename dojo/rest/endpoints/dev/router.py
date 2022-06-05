


from fastapi import APIRouter
import fastapi
from dojo.shared.error_codes.common import ServiceMaintainance
from dojo.shared.error_messages import ErrorMessage

router = APIRouter(prefix="/dev", tags=["Developer Endpoints"])


from dojo.shared.response import ModelErrorMessage, PreinitErrorMessage

@router.get("/test-exception-handling/httpexception")
async def test_http_exception_handling():
    raise fastapi.HTTPException(status_code=500, detail="Test exception handling")

@router.get("/test-exception-handling/initmodel")
async def test_pydantic_model_exception():
    raise ModelErrorMessage(
        model=ErrorMessage(
            error_code="working", error_message="this is working"
        )
    )
    
@router.get("/test-exception-handling/preinitmodel")
async def test_preinit_model_exception():
    raise PreinitErrorMessage(model=ServiceMaintainance)