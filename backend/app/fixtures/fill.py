from collections.abc import Generator

from sqlalchemy.orm import Session

from app.config import config
from app.database.core import get_session
from app.fixtures.models import Fixture
from app.logger import logger
from app.teams.service import get_seasons_teams


def read_fixture_data(
    filepath: str, season: str, name_id_map: dict[str, int]
) -> Generator[dict[str, str | int], None, None]:
    """Read raw fixture data from csv file."""
    with open(filepath) as f:
        next(f)
        for row in f:
            fields = row.strip().split(",")
            yield {
                "date": fields[0],
                "home_team_id": name_id_map[fields[1]],
                "away_team_id": name_id_map[fields[2]],
                "gameweek": fields[5],
                "season": season,
            }


def fill_fixture_table_from_file(
    session: Session, season: str, name_id_map: dict[str, int]
) -> None:
    """Fill SQLAlchemy Fixtures table by season with data from csv files."""
    filepath = config.DATA_DIR / season / "results.csv"
    fixtures = read_fixture_data(
        filepath=filepath, season=season, name_id_map=name_id_map
    )
    session.bulk_insert_mappings(Fixture, fixtures)  # type: ignore[arg-type]
    session.commit()


def make_fixtures_table(seasons: list[str], session: Session) -> None:
    """Make Fixtures table."""
    logger.info(f"Filling 'Fixtures' table with data from {len(seasons)} seasons")
    for season in seasons:
        logger.info(f"Filling {season} season")
        season_teams = get_seasons_teams(session=session, season=season)
        name_id_map: dict[str, int] = {team.name: team.id for team in season_teams}
        fill_fixture_table_from_file(
            session=session, season=season, name_id_map=name_id_map
        )


if __name__ == "__main__":
    with get_session() as session:
        make_fixtures_table(config.SEASONS, session)
