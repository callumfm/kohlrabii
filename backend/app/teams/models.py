from sqlalchemy import Column, Integer, String, UniqueConstraint

from app.database.core import Base


class Team(Base):
    __tablename__ = "teams"
    __table_args__ = (UniqueConstraint("tricode", "season", name="uix_tricode_season"),)

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    tricode: str = Column(String(3), nullable=False)
    name: str = Column(String(100), nullable=False)
    season: str = Column(String(4), nullable=False)
    team_id: int = Column(Integer, nullable=False)

    def __str__(self) -> str:
        return f"{self.name} ({self.tricode})"
