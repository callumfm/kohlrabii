from app.models import KolModel


class CurrentSeasonRead(KolModel):
    season: str
    gameweek: int
