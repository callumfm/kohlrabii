from typing import TYPE_CHECKING

from sqlalchemy import Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.core import Base
from app.models import BaseQuery, KolModel, Pagination

if TYPE_CHECKING:
    from app.fixture_forecasts.models import FixtureForecast
    from app.results.models import Result


class Fixture(Base):
    __tablename__ = "fixture"
    __table_args__ = (
        UniqueConstraint("home_team", "date", name="uix_home_team_date"),
        UniqueConstraint("away_team", "date", name="uix_away_team_date"),
    )

    fixture_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    date: Mapped[str] = mapped_column(String(100), nullable=True)
    season: Mapped[str] = mapped_column(String(100), nullable=False)
    gameweek: Mapped[int] = mapped_column(Integer, nullable=True)
    home_team: Mapped[str] = mapped_column(String(100), nullable=False)
    away_team: Mapped[str] = mapped_column(String(100), nullable=False)

    result: Mapped["Result"] = relationship(
        "Result", uselist=False, back_populates="fixture"
    )
    forecast: Mapped["FixtureForecast"] = relationship(
        "FixtureForecast", uselist=False, back_populates="fixture"
    )

    def __str__(self) -> str:
        return f"{self.season} GW{self.gameweek} - {self.home_team} v {self.away_team}"


class FixtureQuery(BaseQuery):
    season: str | None = None
    team: str | None = None


class FixtureCreate(KolModel):
    date: str | None = None
    gameweek: int | None = None
    home_team: str
    away_team: str
    season: str


class FixtureUpdate(KolModel):
    date: str | None = None
    gameweek: int | None = None


class FixtureRead(KolModel):
    date: str | None
    gameweek: int | None
    home_team: str
    away_team: str
    season: str


class FixtureReadPagination(Pagination):
    items: list[FixtureRead]
