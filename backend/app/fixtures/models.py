from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.core import Base
from app.models import BaseQuery, KolModel, Pagination

if TYPE_CHECKING:
    from app.results.models import Result
    from app.teams.models import Team


class Fixture(Base):
    __tablename__ = "fixture"
    __table_args__ = (
        UniqueConstraint("home_team_id", "date", name="uix_home_team_date"),
        UniqueConstraint("away_team_id", "date", name="uix_away_team_date"),
    )

    fixture_id: int = Column(Integer, primary_key=True, autoincrement=True)
    date: str = Column(String(100), nullable=True)
    season: str = Column(String(100), nullable=False)
    gameweek: int = Column(Integer, nullable=True)
    home_team_id: int = Column(Integer, ForeignKey("teams.id"), nullable=False)
    away_team_id: int = Column(Integer, ForeignKey("teams.id"), nullable=False)

    home_team: "Team" = relationship("Team", foreign_keys=[home_team_id])
    away_team: "Team" = relationship("Team", foreign_keys=[away_team_id])
    result: "Result" = relationship("Result", uselist=False, back_populates="fixture")

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
