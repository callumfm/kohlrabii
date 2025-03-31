from collections.abc import Generator

from sqlalchemy.orm import Session

from app.config import config
from app.database.core import get_session
from app.logger import logger
from app.teams.models import Team


def read_team_data(filepath: str) -> Generator[dict[str, str | int], None, None]:
    """Read raw team data from csv file."""
    with open(filepath) as f:
        next(f)
        for row in f:
            tricode, name, season, team_id = row.strip().split(",")
            yield {
                "tricode": tricode,
                "name": name,
                "season": season,
                "team_id": team_id,
            }


def fill_team_table_from_file(season: str, session: Session) -> None:
    """Fill SQLAlchemy Teams table by season with data from csv files."""
    filepath = config.DATA_DIR / season / "teams.csv"
    teams = read_team_data(filepath=filepath)
    session.bulk_insert_mappings(Team, teams)  # type: ignore[arg-type]
    session.commit()


def make_teams_table(seasons: list[str], session: Session) -> None:
    """Make Teams table."""
    logger.info(f"Filling 'Teams' table with data from {len(seasons)} seasons")
    for season in seasons:
        logger.info(f"Filling {season} season")
        fill_team_table_from_file(season=season, session=session)


if __name__ == "__main__":
    with get_session() as session:
        make_teams_table(seasons=config.SEASONS, session=session)
