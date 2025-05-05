from functools import lru_cache
from typing import TypeAlias

from sqlalchemy.orm import Session

from app.config import config
from app.database.core import get_session
from app.logger import logger
from app.teams.models import SeasonTeam, Team

TeamsToAdd: TypeAlias = list[dict[str, str | int]]


@lru_cache(maxsize=1)
def get_existing_team_tricodes(session: Session) -> dict[str, int]:
    """Get existing team tricodes from the database."""
    teams = session.query(Team.tricode, Team.id).distinct().all()
    return {t.tricode: t.id for t in teams}


def make_teams_table(seasons: list[str], session: Session) -> TeamsToAdd:
    """Make Teams table."""
    logger.info(f"Filling 'Teams' table with data from {len(seasons)} seasons")
    existing_team_tricodes = set(get_existing_team_tricodes(session).keys())
    teams_to_add: TeamsToAdd = []
    season_teams_to_add: TeamsToAdd = []

    for season in seasons:
        logger.info(f"Filling {season} season")
        filepath = config.DATA_DIR / season / "teams.csv"

        with open(filepath) as f:
            next(f)
            for row in f:
                tricode, name, season, team_id = row.strip().split(",")
                short_name = config.SHORT_TEAM_NAMES.get(name, name)

                if tricode not in existing_team_tricodes:
                    teams_to_add.append(
                        {
                            "tricode": tricode,
                            "name": name,
                            "short_name": short_name,
                        }
                    )
                    existing_team_tricodes.add(tricode)

                season_teams_to_add.append(
                    {
                        "tricode": tricode,
                        "season_team_id": team_id,
                        "season": season,
                    }
                )

    session.bulk_insert_mappings(Team, teams_to_add)  # type: ignore[arg-type]
    session.commit()
    return season_teams_to_add


def make_season_teams_table(season_teams_to_add: TeamsToAdd, session: Session) -> None:
    """Make SeasonTeams table."""
    logger.info("Filling 'SeasonTeams' table")
    existing_team_tricodes = get_existing_team_tricodes(session)
    season_teams_to_add = [
        {
            "team_id": existing_team_tricodes[str(season_team["tricode"])],
            "season_team_id": season_team["season_team_id"],
            "season": season_team["season"],
        }
        for season_team in season_teams_to_add
    ]
    session.bulk_insert_mappings(SeasonTeam, season_teams_to_add)  # type: ignore[arg-type]
    session.commit()


def make_teams_tables(seasons: list[str], session: Session) -> None:
    """Make Teams and SeasonTeams tables."""
    season_teams_to_add = make_teams_table(seasons=seasons, session=session)
    make_season_teams_table(season_teams_to_add=season_teams_to_add, session=session)


if __name__ == "__main__":
    with get_session() as session:
        make_teams_tables(seasons=config.SEASONS, session=session)
