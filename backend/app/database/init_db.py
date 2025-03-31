from alembic import command
from alembic.config import Config
from sqlalchemy.orm import Session

from app.config import config
from app.database.core import get_session
from app.fixtures.fill import make_fixtures_table
from app.logger import logger
from app.results.fill import make_results_table
from app.seasons import sort_seasons
from app.teams.fill import make_teams_table
from app.teams.models import Team


def database_is_empty(session: Session) -> bool:
    """Assert whether the database is empty."""
    return session.query(Team).first() is None


def run_migrations(clean: bool = False) -> None:
    """Apply alembic migrations."""
    logger.info("Applying alembic migrations")
    alembic_cfg = Config("alembic.ini")

    if clean:
        command.downgrade(alembic_cfg, "base")

    command.upgrade(alembic_cfg, "head")


def seed_database(session: Session) -> None:
    """Seed the database."""
    logger.info("Seeding database")
    seasons = sort_seasons(config.SEASONS)
    make_teams_table(seasons=seasons, session=session)
    make_fixtures_table(seasons=seasons, session=session)
    make_results_table(seasons=seasons, session=session)


def init_db(session: Session, clean: bool = False) -> None:
    """Initialise the database."""
    logger.info("Initialising database")

    run_migrations(clean=clean)
    seed_database(session)

    logger.info("Database initialised")


if __name__ == "__main__":
    with get_session() as session:
        init_db(session=session, clean=True)
