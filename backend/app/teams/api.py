from typing import Any

from fastapi import APIRouter

from app.database.core import SessionDep
from app.teams.models import TeamRead
from app.teams.service import get_seasons_teams

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("", response_model=list[TeamRead])
async def get_teams_for_season(*, session: SessionDep, season: str) -> Any:
    return get_seasons_teams(session=session, season=season)
