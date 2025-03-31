from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database.core import Base

if TYPE_CHECKING:
    from app.fixtures.models import Fixture


class Result(Base):
    __tablename__ = "result"

    result_id: int = Column(Integer, primary_key=True, autoincrement=True)
    fixture_id: int = Column(Integer, ForeignKey("fixture.fixture_id"))
    home_score: int = Column(Integer, nullable=False)
    away_score: int = Column(Integer, nullable=False)

    fixture: "Fixture" = relationship("Fixture", uselist=False, back_populates="result")

    def __str__(self) -> str:
        return (
            f"{self.fixture.season} GW{self.fixture.gameweek} "
            f"{self.fixture.home_team} {self.home_score} - "
            f"{self.away_score} {self.fixture.away_team}"
        )
