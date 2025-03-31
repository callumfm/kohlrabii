from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.fixtures.models import Fixture, FixtureCreate, FixtureUpdate
from app.teams.service import get_team_from_name


def get_fixture(
    *,
    session: Session,
    team: str | int,
    season: str,
    gameweek: int,
    was_home: bool | None,
    other_team: str | None,
) -> Fixture:
    if isinstance(team, str):
        team_id = get_team_from_name(session=session, season=season, name=team).id
    else:
        team_id = team

    query = session.query(Fixture).filter_by(season=season)
    if gameweek:
        query = query.filter_by(gameweek=gameweek)
    if was_home is True:
        query = query.filter_by(home_team_id=team_id)
    elif was_home is False:
        query = query.filter_by(away_team_id=team_id)
    elif was_home is None:
        query = query.filter(
            or_(Fixture.away_team_id == team_id, Fixture.home_team_id == team_id)
        )
    else:
        raise ValueError("was_home must be True, False or None")

    if other_team:
        if isinstance(other_team, str):
            other_team_id = get_team_from_name(
                session=session, season=season, name=other_team
            ).id
        else:
            other_team_id = other_team

        if was_home is True:
            query = query.filter_by(away_team_id=other_team_id)
        elif was_home is False:
            query = query.filter_by(home_team_id=other_team_id)
        elif was_home is None:
            query = query.filter(
                or_(
                    Fixture.away_team_id == other_team_id,
                    Fixture.home_team_id == other_team_id,
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
    return session.query(Fixture).filter_by(season=season).all()


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
