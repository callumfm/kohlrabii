import urllib.parse
from functools import lru_cache
from typing import Annotated, Any, no_type_check

from pydantic import AnyUrl, BeforeValidator, computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings

from app.enums import Environment


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | tuple):
        return v
    raise ValueError(v)


class AppConfig(BaseSettings):
    PROJECT_NAME: str = "kohlrabi"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: Environment = Environment.LOCAL

    # RESEND_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str

    FRONTEND_URL: str
    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    JWT_ALGORITHM: str = "HS256"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def ALL_CORS_ORIGINS(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_URL
        ]


class PostgresConfig(BaseSettings):
    DB_HOST: str
    DB_PORT: int = 5432
    DB_USER: str
    DB_PASS: str
    DB_NAME: str

    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_PRE_PING: bool = False

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg2",
            host=self.DB_HOST,
            port=self.DB_PORT,
            username=self.DB_USER,
            password=urllib.parse.quote_plus(self.DB_PASS),
            path=self.DB_NAME,
        )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_ENGINE_ARGS(self) -> dict[str, Any]:
        return {
            "pool_size": self.DB_POOL_SIZE,
            "max_overflow": self.DB_MAX_OVERFLOW,
            "pool_pre_ping": self.DB_POOL_PRE_PING,
        }


@no_type_check
@lru_cache(maxsize=1)
def load_config() -> AppConfig | PostgresConfig:
    class ProdDevConfig(AppConfig, PostgresConfig):
        pass

    return ProdDevConfig()


config = load_config()
