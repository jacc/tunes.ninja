import typing

if typing.TYPE_CHECKING:  # pragma: no cover
    import dataclasses

    enable_init_auto_complete = dataclasses.dataclass
else:

    def enable_init_auto_complete(cls):
        return cls