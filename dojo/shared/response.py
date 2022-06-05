from fastapi import Response, HTTPException
from odmantic import Field
from pydantic import BaseModel
from pydantic.main import ModelMetaclass
from starlette.background import BackgroundTask
import typing
from dojo.shared.supported_services import SupportedServices

if typing.TYPE_CHECKING:
    from dojo.shared.error_messages import ErrorMessage


class ModelResponse(Response):
    """Directly return a Pydantic model as a JSON Response."""

    media_type = "application/json"

    def __init__(
        self,
        content: typing.Any,
        status_code: int = 200,
        headers: typing.Optional[dict] = None,
        media_type: typing.Optional[str] = None,
        background: typing.Optional[BackgroundTask] = None,
    ) -> None:
        super().__init__(content, status_code, headers, media_type, background)

    def render(self, content: typing.Any) -> bytes:
        if not isinstance(content, BaseModel):
            raise Exception("Content must be a pydantic model!")

        return content.json(
            encoder={
                "ensure_ascii": False,
                "allow_nan": False,
                "indent": None,
                "separators": (",", ":"),
            }
        ).encode("utf-8")


class PredefinedModelResponse(Response):
    """Directly intiaize a pydantic model with defaults and return as a JSON Response."""

    media_type = "application/json"

    def __init__(
        self,
        content: typing.Any,
        status_code: int = 200,
        headers: typing.Optional[dict] = None,
        media_type: typing.Optional[str] = None,
        background: typing.Optional[BackgroundTask] = None,
    ) -> None:
        super().__init__(content, status_code, headers, media_type, background)

    def render(self, content: typing.Any) -> bytes:
        if not isinstance(content, ModelMetaclass):
            raise Exception("Content must be a ModelMetaclass!")

        return (
            content()
            .json(
                encoder={
                    "ensure_ascii": False,
                    "allow_nan": False,
                    "indent": None,
                    "separators": (",", ":"),
                }
            )
            .encode("utf-8")
        )


class ActionCompleted(BaseModel):
    service: SupportedServices
    action: str


class BackgroundProcessResponse(BaseModel):
    uid: str
    process_name: str


class APIErrorRaw(Exception):
    def __init__(self, error_code: str, error_message: str, status_code: int = 400):
        self.error_code = error_code
        self.error_message = error_message
        self.status_code = status_code


class PreinitErrorMessage(Exception):
    """Use this error for models that need to be initialized before they can be used."""

    def __init__(self, model: typing.Any, status_code: int = 400):
        self.model = model().json(
            encoder={
                "ensure_ascii": False,
                "allow_nan": False,
                "indent": None,
                "separators": (",", ":"),
            }
        ).encode("utf-8")
        self.status_code = status_code
        
        
class ModelErrorMessage(Exception):
    """Use this error for models that have already been initalized """
    def __init__(self, model: typing.Any, status_code: int = 400):
        self.model = model.json(
            encoder={
                "ensure_ascii": False,
                "allow_nan": False,
                "indent": None,
                "separators": (",", ":"),
            }
        ).encode("utf-8")
        self.status_code = status_code
