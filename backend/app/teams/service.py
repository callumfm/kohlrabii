from functools import lru_cache

from sqlalchemy.orm import Session

from app.teams.models import Team


@lru_cache(maxsize=20)
def get_team_from_id(*, session: Session, season: str, team_id: int) -> Team:
    team = session.query(Team).filter(Team.id == team_id, Team.season == season).first()
    if not team:
        raise ValueError(f"'{team_id}' is not a valid team for the {season} season")
    return team


def get_seasons_teams(*, session: Session, season: str) -> list[Team]:
    return session.query(Team).filter(Team.season == season).all()
