from functools import lru_cache

from sqlalchemy.orm import Session

from app.teams.models import SeasonTeam, Team


@lru_cache(maxsize=20)
def get_team_from_id(*, session: Session, season: str, team_id: int) -> Team:
    """Get a team for a specific season by team_id."""
    season_team = (
        session.query(SeasonTeam)
        .filter(SeasonTeam.season_team_id == team_id, SeasonTeam.season == season)
        .first()
    )

    if not season_team:
        raise ValueError(f"'{team_id}' is not a valid team for the {season} season")

    return season_team.team


def get_team_from_name(*, session: Session, team_name: str) -> Team:
    """Get a team for a specific season by team_name."""
    team = session.query(Team).filter(Team.name == team_name).first()
    if not team:
        raise ValueError(f"'{team_name}' is not a valid team")
    return team


def get_seasons_teams(*, session: Session, season: str) -> list[Team]:
    """Get all teams for a specific season."""
    season_teams = session.query(SeasonTeam).filter(SeasonTeam.season == season).all()
    return [st.team for st in season_teams]
