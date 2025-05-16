from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.core import Base
from app.models import KolModel

if TYPE_CHECKING:
    from app.fixtures.models import Fixture


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tricode: Mapped[str] = mapped_column(String(3), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    short_name: Mapped[str] = mapped_column(String(100), nullable=False)

    seasons: Mapped[list["SeasonTeam"]] = relationship(
        "SeasonTeam", back_populates="team"
    )
    home_fixtures: Mapped[list["Fixture"]] = relationship(
        "Fixture", foreign_keys="Fixture.home_team_id", back_populates="home_team"
    )
    away_fixtures: Mapped[list["Fixture"]] = relationship(
        "Fixture", foreign_keys="Fixture.away_team_id", back_populates="away_team"
    )

    def __str__(self) -> str:
        return f"{self.name} ({self.tricode})"


class SeasonTeam(Base):
    __tablename__ = "season_teams"
    __table_args__ = (
        UniqueConstraint("season_team_id", "season", name="uix_team_season"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    team_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("teams.id"), nullable=False
    )
    season_team_id: Mapped[int] = mapped_column(Integer, nullable=False)
    season: Mapped[str] = mapped_column(String(4), nullable=False, index=True)

    team: Mapped["Team"] = relationship("Team", back_populates="seasons")

    def __str__(self) -> str:
        return f"{self.season_team_id} - Season: {self.season}"


class TeamRead(KolModel):
    id: int
    tricode: str
    name: str
    short_name: str
