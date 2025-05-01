"""Back-fill team performance forecasts over historical data."""

from typing import TypeAlias

import numpy as np
import numpy.typing as npt
import pandas as pd
from sqlalchemy import Row
from sqlalchemy.orm import Session, aliased

from app.database.core import get_session
from app.fixtures.forecasts.dixon_coles import DixonColesModel
from app.fixtures.forecasts.models import FixtureForecast
from app.fixtures.models import Fixture
from app.logger import logger
from app.results.models import Result
from app.teams.models import Team

FORECAST_HORIZON = 10

TrainResults: TypeAlias = dict[
    str, npt.NDArray[np.datetime64] | npt.NDArray[np.float64] | npt.NDArray[np.str_]
]


def get_train_results(session: Session, end_season: str, end_gw: int) -> TrainResults:
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

    HomeTeam = aliased(Team)
    AwayTeam = aliased(Team)

    results = (
        session.query(
            Fixture.date,
            HomeTeam.name.label("home_team"),
            AwayTeam.name.label("away_team"),
            Result.home_score,
            Result.away_score,
        )
        .join(Result.fixture)
        .join(HomeTeam, Fixture.home_team_id == HomeTeam.id)
        .join(AwayTeam, Fixture.away_team_id == AwayTeam.id)
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
) -> list[Row[tuple[int, str, str]]]:
    """Get the fixtures for the test set."""
    logger.info("Loading test set...")
    HomeTeam = aliased(Team)
    AwayTeam = aliased(Team)
    fixtures = (
        session.query(
            Fixture.fixture_id,
            HomeTeam.name.label("home_team"),
            AwayTeam.name.label("away_team"),
        )
        .join(HomeTeam, Fixture.home_team_id == HomeTeam.id)
        .join(AwayTeam, Fixture.away_team_id == AwayTeam.id)
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
    logger.info("Filling 'FixtureForecasts' table...")
    # TODO: Get latest gameweek and season
    if not split_gameweek:
        split_gameweek = 1
    if not split_season:
        split_season = "2324"

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
    model = DixonColesModel(**train)  # type: ignore[arg-type]
    model.fit()
    for fixture in test:
        yhat = model.predict(home_team=fixture.home_team, away_team=fixture.away_team)
        ff = FixtureForecast(fixture_id=fixture.fixture_id, **yhat)  # type: ignore
        session.add(ff)
    session.commit()


if __name__ == "__main__":
    with get_session() as session:
        fill_fixture_forecasts(
            session=session,
            split_gameweek=19,
            split_season="2324",
        )
