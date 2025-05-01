from functools import lru_cache
from typing import TypeAlias

from playwright.sync_api import sync_playwright
from sqlalchemy.orm import Session

from app.config import config
from app.database.core import get_session
from app.logger import logger
from app.teams.models import SeasonTeam, Team

PREMIER_LEAGUE_CLUBS_URL = "https://www.premierleague.com/clubs"

TeamsToAdd: TypeAlias = list[dict[str, str | int]]


def get_team_badge_uris() -> dict[str, str]:
    """Get team badge uris and links for all teams."""
    logger.info("Getting team badge URIs")
    team_badges = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(PREMIER_LEAGUE_CLUBS_URL, wait_until="networkidle")
        page.wait_for_selector("td.team")

        for team_cell in page.query_selector_all("td.team"):
            badge_img = team_cell.query_selector("img.badge-image")
            badge_src = badge_img.get_attribute("src") if badge_img else None
            team_name = team_cell.inner_text().strip().replace(" & ", " and ")

            if team_name and badge_src:
                team_badges[team_name] = badge_src

        browser.close()

    logger.info(f"Successfully extracted badge URIs for {len(team_badges)} teams")
    return team_badges


@lru_cache(maxsize=1)
def get_existing_team_tricodes(session: Session) -> dict[str, int]:
    """Get existing team tricodes from the database."""
    teams = session.query(Team.tricode, Team.id).distinct().all()
    return {t.tricode: t.id for t in teams}


def get_badge_uri(name: str, short_name: str, badge_uris: dict[str, str]) -> str:
    """Get badge URI for a team."""
    if name in badge_uris:
        return badge_uris[name]
    elif short_name in badge_uris:
        return badge_uris[short_name]

    raise ValueError(f"No badge URI found for team {name} or {short_name}")


def make_teams_table(seasons: list[str], session: Session) -> TeamsToAdd:
    """Make Teams table."""
    logger.info(f"Filling 'Teams' table with data from {len(seasons)} seasons")
    badge_uris = get_team_badge_uris()
    existing_team_tricodes = set(get_existing_team_tricodes(session).keys())
    teams_to_add: TeamsToAdd = []
    season_teams_to_add: TeamsToAdd = []

    for season in seasons:
        logger.info(f"Filling {season} season")
        filepath = config.DATA_DIR / season / "teams.csv"

        with open(filepath) as f:
            next(f)
            for row in f:
                tricode, name, season, team_id = row.strip().split(",")
                short_name = config.SHORT_TEAM_NAMES.get(name, name)
                badge_uri = get_badge_uri(name, short_name, badge_uris)

                if tricode not in existing_team_tricodes:
                    teams_to_add.append(
                        {
                            "tricode": tricode,
                            "name": name,
                            "short_name": short_name,
                            "badge_uri": badge_uri,
                        }
                    )
                    existing_team_tricodes.add(tricode)

                season_teams_to_add.append(
                    {
                        "tricode": tricode,
                        "season_team_id": team_id,
                        "season": season,
                    }
                )

    session.bulk_insert_mappings(Team, teams_to_add)  # type: ignore[arg-type]
    session.commit()
    return season_teams_to_add


def make_season_teams_table(season_teams_to_add: TeamsToAdd, session: Session) -> None:
    """Make SeasonTeams table."""
    logger.info("Filling 'SeasonTeams' table")
    existing_team_tricodes = get_existing_team_tricodes(session)
    season_teams_to_add = [
        {
            "team_id": existing_team_tricodes[str(season_team["tricode"])],
            "season_team_id": season_team["season_team_id"],
            "season": season_team["season"],
        }
        for season_team in season_teams_to_add
    ]
    session.bulk_insert_mappings(SeasonTeam, season_teams_to_add)  # type: ignore[arg-type]
    session.commit()


def make_teams_tables(seasons: list[str], session: Session) -> None:
    """Make Teams and SeasonTeams tables."""
    season_teams_to_add = make_teams_table(seasons=seasons, session=session)
    make_season_teams_table(season_teams_to_add=season_teams_to_add, session=session)


if __name__ == "__main__":
    with get_session() as session:
        make_teams_tables(seasons=config.SEASONS, session=session)
