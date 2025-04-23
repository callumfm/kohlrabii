from typing import Literal, TypeAlias

from pydantic import Field

from app.config import config

Season: TypeAlias = Literal[tuple(config.SEASONS)]  # type: ignore[valid-type]
NullGameweek = Field(default=None, ge=1, le=38)
