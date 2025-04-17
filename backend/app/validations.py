from pydantic import Field

Gameweek = Field(default=None, ge=1, le=38)
