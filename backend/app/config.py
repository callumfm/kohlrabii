import urllib.parse
from functools import lru_cache
from pathlib import Path
from typing import Annotated, Any, no_type_check

from pydantic import AnyUrl, BeforeValidator, computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.enums import Environment


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


def get_model_config() -> SettingsConfigDict:
    return SettingsConfigDict(
        env_file=".env.local",
        env_ignore_empty=True,
        extra="ignore",
    )


class AppConfig(BaseSettings):
    model_config = get_model_config()

    PROJECT_NAME: str = "kohlrabii"
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

    DATA_DIR: Path = Path(__file__).parent.parent / "data"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def ALL_CORS_ORIGINS(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_URL
        ]


class FootballConfig(BaseSettings):
    model_config = get_model_config()

    SEASONS: list[str] = [
        "1516",
        "1617",
        "1718",
        "1819",
        "1920",
        "2021",
        "2122",
        "2223",
        "2324",
    ]


class PostgresConfig(BaseSettings):
    model_config = get_model_config()

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
    def SQLALCHEMY_DATABASE_URI(self) -> MultiHostUrl:
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
def load_config() -> AppConfig | FootballConfig | PostgresConfig:
    class ProdDevConfig(AppConfig, FootballConfig, PostgresConfig):
        pass

    return ProdDevConfig()


config = load_config()
