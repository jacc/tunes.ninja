import arrow


class ArrowTime(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def __modify_schema__(cls, field_schema):
        # __modify_schema__ should mutate the dict it receives in place,
        # the returned value will be ignored
        field_schema.update(
            # simplified regex here for brevity, see the wikipedia link above
            pattern="/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/",
            examples=[
                "2022-05-16T01:27:19.902569+00:00",
                "2025-03-16T01:27:39.950389+00:00",
            ],
        )

    @classmethod
    def validate(cls, v):
        if not isinstance(v, (arrow.Arrow, str)):
            raise TypeError("A string or arrow.Arrow object is required.")

        try:
            validate = arrow.get(v)
        except (arrow.parser.ParserError, arrow.parser.ParserMatchError):
            raise ValueError("Invalid arrow.Arrow or string format")

        return validate.isoformat()

    def __repr__(self) -> str:
        return f"ArrowTime({super().__repr__()})"
