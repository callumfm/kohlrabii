"""Back-fill team performance forecasts over historical data."""

import numpy as np
import pandas as pd
from sqlalchemy.orm import Session

from app.database.core import get_session
from app.fixture_forecasts.dixon_coles import DixonColesModel
from app.fixture_forecasts.models import FixtureForecast
from app.fixtures.models import Fixture
from app.logger import logger
from app.results.models import Result

FORECAST_HORIZON = 3


def get_train_results(
    session: Session, end_season: str, end_gw: int
) -> dict[str, np.ndarray]:
    """Get the results for the training set."""
    logger.info("Loading train set...")
    latest_date = (
        session.query(Fixture.date)
        .join(Result.fixture)
        .filter(Fixture.season == end_season, Fixture.gameweek == end_gw)
        .order_by(Fixture.date.desc())
        .first()
    )
    if not latest_date:
        raise ValueError(
            f"No results found for the given season {end_season} and gameweek {end_gw}"
        )

    results = (
        session.query(
            Fixture.date,
            Fixture.home_team,
            Fixture.away_team,
            Result.home_score,
            Result.away_score,
        )
        .join(Result.fixture)
        .filter(Fixture.date <= latest_date.date)
        .all()
    )
    logger.info(f"Train set size: {len(results)}")

    return {
        "date": np.array(
            pd.to_datetime([r.date for r in results], format="mixed", utc=True),
            dtype="datetime64[D]",
        ),
        "home_team": np.array([r.home_team for r in results]),
        "away_team": np.array([r.away_team for r in results]),
        "home_goals": np.array([r.home_score for r in results]),
        "away_goals": np.array([r.away_score for r in results]),
    }


def get_test_fixtures(
    session: Session, season: str, start_gw: int, horizon: int | None = None
) -> list[Fixture]:
    """Get the fixtures for the test set."""
    logger.info("Loading test set...")
    fixtures = (
        session.query(
            Fixture.fixture_id,
            Fixture.home_team,
            Fixture.away_team,
        )
        .filter(Fixture.season == season, Fixture.gameweek == start_gw)
        .order_by(Fixture.date.desc())
        .limit(horizon)
        .all()
    )
    logger.info(f"Test set size: {len(fixtures)}")
    return fixtures


def fill_fixture_forecasts(
    session: Session,
    split_gameweek: int | None = None,
    split_season: str | None = None,
    horizon: int = FORECAST_HORIZON,
) -> None:
    """Back-fill team performance forecasts over historical data."""
    train = get_train_results(
        session=session,
        end_season=split_season,
        end_gw=split_gameweek,
    )
    test = get_test_fixtures(
        session=session,
        season=split_season,
        start_gw=split_gameweek,
        horizon=horizon,
    )
    model = DixonColesModel(**train)
    model.fit()
    for fixture in test:
        yhat = model.predict(fixture.home_team, fixture.away_team)
        ff = FixtureForecast(fixture_id=fixture.fixture_id, **yhat)
        session.add(ff)
    session.commit()


if __name__ == "__main__":
    with get_session() as session:
        fill_fixture_forecasts(
            session=session,
            split_gameweek=19,
            split_season="2324",
            horizon=3,
        )
