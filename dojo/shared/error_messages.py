import enum
import typing
from pydantic import BaseModel, Field
import arrow


class ErrorMessage(BaseModel):
    error_code: str
    error_message: typing.Optional[str] = None
    error_time: typing.Optional[str] = Field(
        default_factory=lambda: arrow.utcnow().isoformat()
    )

