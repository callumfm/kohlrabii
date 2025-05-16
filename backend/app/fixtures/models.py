from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.core import Base
from app.models import BaseQuery, KolModel, Pagination
from app.results.models import ResultRead
from app.teams.models import TeamRead
from app.validations import NullGameweek, Season

if TYPE_CHECKING:
    from app.fixtures.forecasts.models import FixtureForecast
    from app.results.models import Result
    from app.teams.models import Team


class Fixture(Base):
    __tablename__ = "fixture"
    __table_args__ = (
        UniqueConstraint("home_team_id", "date", name="uix_home_team_date"),
        UniqueConstraint("away_team_id", "date", name="uix_away_team_date"),
    )

    fixture_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    date: Mapped[str] = mapped_column(String(100), nullable=True)
    season: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    gameweek: Mapped[int] = mapped_column(Integer, nullable=True, index=True)
    home_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    away_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)

    home_team: Mapped["Team"] = relationship(
        "Team", foreign_keys=[home_team_id], back_populates="home_fixtures"
    )
    away_team: Mapped["Team"] = relationship(
        "Team", foreign_keys=[away_team_id], back_populates="away_fixtures"
    )
    result: Mapped["Result"] = relationship(
        "Result", uselist=False, back_populates="fixture"
    )
    forecast: Mapped["FixtureForecast"] = relationship(
        "FixtureForecast", uselist=False, back_populates="fixture"
    )

    def __str__(self) -> str:
        return f"{self.season} GW{self.gameweek} - {self.home_team.name} v {self.away_team.name}"


class FixtureQuery(BaseQuery):
    season: Season | None = None
    gameweek: int | None = NullGameweek
    date: str | None = None
    team_id: int | None = None
    sort_by: str | None = "date"
    sort_desc: bool = False


class FixtureCreate(KolModel):
    date: str | None = None
    season: Season
    gameweek: int | None = NullGameweek
    home_team_id: int
    away_team_id: int


class FixtureUpdate(KolModel):
    date: str | None = None
    gameweek: int | None = NullGameweek


class FixtureRead(KolModel):
    fixture_id: int
    date: str | None
    gameweek: int | None
    season: str
    home_team: TeamRead
    away_team: TeamRead
    result: ResultRead | None
    # forecast: FixtureForecastRead | None


class FixtureReadPagination(Pagination):
    items: list[FixtureRead]
