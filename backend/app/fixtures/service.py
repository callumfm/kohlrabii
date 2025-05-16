from typing import Any

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.database.utils import sort_and_paginate
from app.fixtures.models import Fixture, FixtureCreate, FixtureQuery, FixtureUpdate
from app.teams.models import Team
from app.teams.service import get_team_from_season_id


def get_fixtures_query(*, session: Session, query_in: FixtureQuery) -> dict[str, Any]:
    query = session.query(Fixture).options(
        joinedload(Fixture.home_team),
        joinedload(Fixture.away_team),
        joinedload(Fixture.result),
    )

    if query_in.season:
        query = query.filter_by(season=query_in.season)

    if query_in.gameweek:
        query = query.filter_by(gameweek=query_in.gameweek)

    if query_in.team_id:
        query = query.filter(
            or_(
                Fixture.home_team_id == query_in.team_id,
                Fixture.away_team_id == query_in.team_id,
            )
        )

    if query_in.date:
        query = query.filter_by(date=query_in.date)

    return sort_and_paginate(
        query=query,
        table=Fixture,
        query_in=query_in,
    )


def get_fixture(
    *,
    session: Session,
    team: str | int,
    season: str,
    gameweek: int,
    was_home: bool | None,
    other_team: str | None,
) -> Fixture:
    if isinstance(team, int):
        team = get_team_from_season_id(
            session=session, season=season, team_id=team
        ).name

    query = session.query(Fixture).filter_by(season=season)
    if gameweek:
        query = query.filter_by(gameweek=gameweek)
    if was_home is True:
        query = query.filter_by(home_team=team)
    elif was_home is False:
        query = query.filter_by(away_team=team)
    else:
        query = query.filter(or_(Fixture.away_team == team, Fixture.home_team == team))

    if other_team:
        if isinstance(other_team, str):
            other_team = get_team_from_season_id(
                session=session, season=season, team_id=other_team
            ).name

        if was_home is True:
            query = query.filter_by(away_team=other_team)
        elif was_home is False:
            query = query.filter_by(home_team=other_team)
        elif was_home is None:
            query = query.filter(
                or_(
                    Fixture.away_team == other_team,
                    Fixture.home_team == other_team,
                )
            )

    fixtures = query.all()

    if not fixtures or len(fixtures) == 0:
        raise ValueError(
            f"No fixture with season={season}, gw={gameweek}, "
            f"team_name={team}, was_home={was_home}, "
            f"other_team_name={other_team}"
        )

    return fixtures[0]


def get_seasons_fixtures(*, session: Session, season: str) -> list[Fixture]:
    # TODO: Do we need results here? Limit the scope to just id, teams and date?
    return (
        session.query(Fixture)
        .options(
            joinedload(Fixture.home_team).load_only(Team.name),
            joinedload(Fixture.away_team).load_only(Team.name),
        )
        .filter_by(season=season)
        .all()
    )


def create_fixture(*, session: Session, fixture_in: FixtureCreate) -> Fixture:
    fixture = Fixture(**fixture_in.model_dump())
    session.add(fixture)
    session.commit()
    session.refresh(fixture)
    return fixture


def update_fixture(
    *, session: Session, fixture: Fixture, fixture_in: FixtureUpdate
) -> Fixture:
    fixture_data = fixture_in.model_dump(exclude_unset=True)

    for field in fixture.to_dict():
        if field in fixture_data:
            setattr(fixture, field, fixture_data[field])

    session.commit()
    session.refresh(fixture)
    return fixture
