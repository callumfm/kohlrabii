from functools import lru_cache

from sqlalchemy.orm import Session

from app.teams.models import Team


@lru_cache(maxsize=20)
def get_team_from_name(*, session: Session, season: str, name: str) -> Team:
    team = session.query(Team).filter(Team.name == name, Team.season == season).first()
    if not team:
        raise ValueError(f"'{name}' is not a valid team for the {season} season")
    return team


def get_seasons_teams(*, session: Session, season: str) -> list[Team]:
    return session.query(Team).filter(Team.season == season).all()
