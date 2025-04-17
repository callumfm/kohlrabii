from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.core import Base
from app.models import KolModel

if TYPE_CHECKING:
    from app.fixtures.models import Fixture


class Result(Base):
    __tablename__ = "result"

    result_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    fixture_id: Mapped[int] = mapped_column(Integer, ForeignKey("fixture.fixture_id"))
    home_score: Mapped[int] = mapped_column(Integer, nullable=False)
    away_score: Mapped[int] = mapped_column(Integer, nullable=False)

    fixture: Mapped["Fixture"] = relationship(
        "Fixture", uselist=False, back_populates="result"
    )

    def __str__(self) -> str:
        return (
            f"{self.fixture.season} GW{self.fixture.gameweek} "
            f"{self.fixture.home_team} {self.home_score} - "
            f"{self.away_score} {self.fixture.away_team}"
        )


class ResultRead(KolModel):
    home_score: int
    away_score: int
