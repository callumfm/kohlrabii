from sqlalchemy import Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.core import Base
from app.models import KolModel


class Team(Base):
    __tablename__ = "teams"
    __table_args__ = (UniqueConstraint("tricode", "season", name="uix_tricode_season"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tricode: Mapped[str] = mapped_column(String(3), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    season: Mapped[str] = mapped_column(String(4), nullable=False)
    team_id: Mapped[int] = mapped_column(Integer, nullable=False)

    def __str__(self) -> str:
        return f"{self.name} ({self.tricode})"


class TeamRead(KolModel):
    tricode: str
    name: str
