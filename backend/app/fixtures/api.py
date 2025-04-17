from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_

from app.database.core import SessionDep
from app.database.utils import sort_and_paginate
from app.fixtures.models import (
    Fixture,
    FixtureQuery,
    FixtureRead,
    FixtureReadPagination,
)

router = APIRouter(prefix="/fixtures", tags=["fixtures"])


@router.get("/", response_model=FixtureReadPagination)
def get_fixtures_query(
    *, session: SessionDep, query_in: FixtureQuery = Depends()
) -> Any:
    query = session.query(Fixture)
    if query_in.season:
        query = query.filter_by(season=query_in.season)

    if query_in.gameweek:
        query = query.filter_by(gameweek=query_in.gameweek)

    if query_in.team:
        query = query.filter(
            or_(
                Fixture.home_team == query_in.team,
                Fixture.away_team == query_in.team,
            )
        )

    if query_in.date:
        query = query.filter_by(date=query_in.date)

    return sort_and_paginate(
        query=query,
        table=Fixture,
        query_in=query_in,
    )


@router.get("/{fixture_id}", response_model=FixtureRead)
def get_fixture(*, session: SessionDep, fixture_id: int) -> Any:
    fixture = session.get(Fixture, fixture_id)
    if not fixture:
        raise HTTPException(status_code=404, detail=f"Fixture {fixture_id} not found")
    return fixture
