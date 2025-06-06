from pydantic import BaseModel, ConfigDict, Field


class KolModel(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True,
        arbitrary_types_allowed=True,
        str_strip_whitespace=True,
    )


class BaseQuery(KolModel):
    sort_by: str | None = None
    sort_desc: bool = True
    page: int = Field(default=0, ge=0)
    page_size: int = Field(default=10, ge=1)


class Pagination(KolModel):
    total: int
    page: int
    page_size: int
    total_pages: int


class Message(BaseModel):
    message: str
