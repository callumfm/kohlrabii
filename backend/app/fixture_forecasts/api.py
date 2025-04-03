from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import or_

from app.database.core import SessionDep
from app.database.utils import sort_and_paginate
from app.fixture_forecasts.models import (
    FixtureForecast,
    FixtureForecastQuery,
    FixtureForecastReadPagination,
)
from app.fixtures.models import Fixture

router = APIRouter(prefix="/fixture-forecasts", tags=["fixture-forecasts"])


@router.get("/", response_model=FixtureForecastReadPagination)
def get_fixture_forecasts_query(
    *, session: SessionDep, query_in: FixtureForecastQuery = Depends()
) -> Any:
    query = session.query(FixtureForecast).join(Fixture.forecast)
    if query_in.season:
        query = query.filter(Fixture.season == query_in.season)

    if query_in.gameweek:
        query = query.filter(Fixture.gameweek == query_in.gameweek)

    if query_in.team:
        query = query.filter(
            or_(
                Fixture.home_team == query_in.team,
                Fixture.away_team == query_in.team,
            )
        )

    if query_in.date:
        query = query.filter(Fixture.date == query_in.date)

    return sort_and_paginate(
        query=query,
        table=FixtureForecast,
        query_in=query_in,
    )
