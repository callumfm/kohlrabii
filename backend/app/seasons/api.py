from fastapi import APIRouter

from app.config import config
from app.seasons.models import CurrentSeasonRead

router = APIRouter(prefix="/seasons", tags=["seasons"])


@router.get("/current")
def get_current_season() -> CurrentSeasonRead:
    return CurrentSeasonRead(
        season=config.CURRENT_SEASON,
        gameweek=config.CURRENT_GAMEWEEK,
    )
