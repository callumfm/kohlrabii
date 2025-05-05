from typing import Any

from fastapi import APIRouter, HTTPException

from app.database.core import SessionDep
from app.teams.models import Team, TeamRead
from app.teams.service import get_seasons_teams

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("/{team_id}", response_model=TeamRead)
def get_team_by_id(*, session: SessionDep, team_id: int) -> Any:
    if not (team := session.get(Team, team_id)):
        raise HTTPException(status_code=404, detail=f"Team with id {team_id} not found")
    return team


@router.get("", response_model=list[TeamRead])
def get_teams_for_season(*, session: SessionDep, season: str) -> Any:
    return get_seasons_teams(session=session, season=season)
