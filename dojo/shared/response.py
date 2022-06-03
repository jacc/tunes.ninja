from fastapi import Response
from odmantic import Field
from pydantic import BaseModel
from pydantic.main import ModelMetaclass
from starlette.background import BackgroundTask
import typing


class ModelResponse(Response):
    """Directly return a Pydantic model as a JSON Response.
    """
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
    """Directly intiaize a pydantic model with defaults and return as a JSON Response.
    """
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

        return content().json(
            encoder={
                "ensure_ascii": False,
                "allow_nan": False,
                "indent": None,
                "separators": (",", ":"),
            }
        ).encode("utf-8")



class BackgroundProcessResponse(BaseModel):
    uid: str
    process_name: str