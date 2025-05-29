import os
import urllib.parse
from functools import lru_cache
from pathlib import Path
from typing import Any, no_type_check

from pydantic import computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.enums import Environment

Environ: Environment = Environment(os.environ.get("ENVIRONMENT", "dev"))


@lru_cache(maxsize=1)
def get_model_config() -> SettingsConfigDict:
    env_file = Path(__file__).resolve().parent.parent / f".env.{Environ.value}"
    return SettingsConfigDict(
        env_file=str(env_file),
        env_ignore_empty=True,
        extra="ignore",
    )


class AppConfig(BaseSettings):
    """Project configuration."""

    model_config = get_model_config()

    PROJECT_NAME: str = "kohlrabii"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: Environment = Environ

    # RESEND_API_KEY: str
    SENTRY_DSN: str

    FRONTEND_URL: str
    FRONTEND_PREVIEW_URL: str = r"https://kohlrabii-[a-z0-9]+-kohlrabii\.vercel\.app"

    JWT_ALGORITHM: str = "HS256"
    DATA_DIR: Path = Path(__file__).parent.parent / "data"


class SupabaseConfig(BaseSettings):
    """Supabase configuration."""

    model_config = get_model_config()

    SUPABASE_PROJECT_ID: str
    SUPABASE_SERVICE_KEY: str

    SUPABASE_JWT_SECRET: str
    SUPABASE_JWT_ALGORITHM: str = "HS256"
    SUPABASE_JWT_AUDIENCE: str = "authenticated"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SUPABASE_URL(self) -> str:
        return f"https://{self.SUPABASE_PROJECT_ID}.supabase.co"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SUPABASE_SESSION_COOKIE(self) -> str:
        return f"sb-{self.SUPABASE_PROJECT_ID}-auth-token"


class PostgresConfig(BaseSettings):
    """PostgresQL database configuration."""

    model_config = get_model_config()

    DB_HOST: str
    DB_PORT: int = 6543  # 5432: direct connection for migrations
    DB_USER: str
    DB_PASS: str
    DB_NAME: str

    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_PRE_PING: bool = False

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> MultiHostUrl | str:
        if Environ == Environment.TEST:
            return "sqlite:///:memory:"

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
        if Environ == Environment.TEST:
            from sqlalchemy.pool import StaticPool

            return {
                "connect_args": {"check_same_thread": False},
                "poolclass": StaticPool,
            }

        return {
            "pool_size": self.DB_POOL_SIZE,
            "max_overflow": self.DB_MAX_OVERFLOW,
            "pool_pre_ping": self.DB_POOL_PRE_PING,
        }


class FootballConfig(BaseSettings):
    model_config = get_model_config()

    @computed_field  # type: ignore[prop-decorator]
    @property
    def CURRENT_SEASON(self) -> str:
        # current_time = datetime.now()
        # if current_time.month > 5:
        #     start_year = current_time.year
        # else:
        #     start_year = current_time.year - 1
        # end_year = start_year + 1
        # return f"{str(start_year)[2:]}{str(end_year)[2:]}"
        return "2324"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def CURRENT_GAMEWEEK(self) -> int:
        return 38

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

    SHORT_TEAM_NAMES: dict[str, str] = {
        "Brighton and Hove Albion": "Brighton",
        "Cardiff City": "Cardiff",
        "Huddersfield Town": "Huddersfield",
        "Leicester City": "Leicester",
        "Leeds United": "Leeds",
        "Luton Town": "Luton",
        "Manchester City": "Man City",
        "Manchester United": "Man Utd",
        "Newcastle United": "Newcastle",
        "Norwich City": "Norwich",
        "Nottingham Forest": "Nott'm Forest",
        "Sheffield United": "Sheffield Utd",
        "Swansea City": "Swansea",
        "Tottenham Hotspur": "Tottenham",
        "West Ham United": "West Ham",
        "West Bromwich Albion": "West Brom",
        "Wolverhampton Wanderers": "Wolves",
    }


@no_type_check
@lru_cache(maxsize=1)
def load_config() -> AppConfig | SupabaseConfig | PostgresConfig | FootballConfig:
    class Config(AppConfig, SupabaseConfig, PostgresConfig, FootballConfig):
        pass

    return Config()


config = load_config()
