from collections.abc import Generator
from typing import TypeAlias

from sqlalchemy.orm import Session

from app.config import config
from app.database.core import get_session
from app.fixtures.service import get_seasons_fixtures
from app.logger import logger
from app.results.models import Result

FixtureMap: TypeAlias = dict[tuple[str, str], int]


def read_results_data(
    filepath: str, fixture_id_map: FixtureMap
) -> Generator[dict[str, int], None, None]:
    """Read raw result data from csv file."""
    with open(filepath) as f:
        next(f)
        for row in f:
            fields = row.strip().split(",")
            yield {
                "fixture_id": fixture_id_map[(fields[1], fields[2])],
                "home_score": int(fields[3]),
                "away_score": int(fields[4]),
            }


def fill_results_table_from_file(
    session: Session, season: str, fixture_id_map: FixtureMap
) -> None:
    """Fill SQLAlchemy Results table by season with data from csv files."""
    filepath = config.DATA_DIR / season / "results.csv"
    results = read_results_data(filepath=filepath, fixture_id_map=fixture_id_map)
    session.bulk_insert_mappings(Result, results)  # type: ignore[arg-type]
    session.commit()


def make_results_table(seasons: list[str], session: Session) -> None:
    """Make Results table."""
    logger.info(f"Filling 'Results' table with data from {len(seasons)} seasons")
    for season in seasons:
        logger.info(f"Filling {season} season")
        season_fixtures = get_seasons_fixtures(session=session, season=season)
        fixture_id_map: FixtureMap = {
            (f.home_team.name, f.away_team.name): f.fixture_id for f in season_fixtures
        }
        fill_results_table_from_file(
            session=session, season=season, fixture_id_map=fixture_id_map
        )


if __name__ == "__main__":
    with get_session() as session:
        make_results_table(config.SEASONS, session)
