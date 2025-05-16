from typing import Any

from fastapi import APIRouter, Depends

from app.database.core import SessionDep
from app.fixtures import service
from app.fixtures.models import (
    FixtureQuery,
    FixtureReadPagination,
)

router = APIRouter(prefix="/fixtures", tags=["fixtures"])


@router.get("", response_model=FixtureReadPagination)
def get_fixtures_query(
    *, session: SessionDep, query_in: FixtureQuery = Depends()
) -> Any:
    return service.get_fixtures_query(session=session, query_in=query_in)


# @router.get("/{fixture_id}", response_model=FixtureRead)
# def get_fixture(*, session: SessionDep, fixture_id: int) -> Any:
#     fixture = session.get(Fixture, fixture_id)
#     if not fixture:
#         raise HTTPException(status_code=404, detail=f"Fixture {fixture_id} not found")
#     return fixture
