from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.core import Base
from app.fixtures.models import FixtureRead
from app.models import BaseQuery, KolModel, Pagination

if TYPE_CHECKING:
    from app.fixtures.models import Fixture


class FixtureForecast(Base):
    __tablename__ = "fixture_forecasts"

    forecast_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    fixture_id: Mapped[int] = mapped_column(Integer, ForeignKey("fixture.fixture_id"))
    home_win: Mapped[float] = mapped_column(Float, nullable=False)
    away_win: Mapped[float] = mapped_column(Float, nullable=False)
    home_clean_sheet: Mapped[float] = mapped_column(Float, nullable=False)
    away_clean_sheet: Mapped[float] = mapped_column(Float, nullable=False)
    home_goals_for: Mapped[float] = mapped_column(Float, nullable=False)
    away_goals_for: Mapped[float] = mapped_column(Float, nullable=False)
    home_attack: Mapped[float] = mapped_column(Float, nullable=False)
    away_attack: Mapped[float] = mapped_column(Float, nullable=False)
    home_defence: Mapped[float] = mapped_column(Float, nullable=False)
    away_defence: Mapped[float] = mapped_column(Float, nullable=False)

    fixture: Mapped["Fixture"] = relationship(
        "Fixture", uselist=False, back_populates="forecast"
    )

    def __str__(self) -> str:
        return (
            f"{self.fixture.season} GW{self.fixture.gameweek} "
            f"{self.fixture.home_team} {self.home_goals_for} - "
            f"{self.away_goals_for} {self.fixture.away_team}"
        )


class FixtureForecastQuery(BaseQuery):
    season: str | None = None
    gameweek: int | None = None
    date: str | None = None
    team: str | None = None


class FixtureForecastRead(KolModel):
    home_win: float
    away_win: float
    home_clean_sheet: float
    away_clean_sheet: float
    home_goals_for: float
    away_goals_for: float
    fixture: FixtureRead


class FixtureForecastReadPagination(Pagination):
    items: list[FixtureForecastRead]


class FixtureForecastUpdate(KolModel):
    pass
