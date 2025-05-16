import requests
from playwright.sync_api import sync_playwright

from app.config import config
from app.database.core import get_session
from app.logger import logger
from app.supabase import get_supabase_client
from app.teams.models import Team

PREMIER_LEAGUE_CLUBS_URL = "https://www.premierleague.com/clubs"

BADGE_DIR = config.DATA_DIR / "badges"
BADGE_DIR.mkdir(parents=True, exist_ok=True)


def get_team_ids() -> dict[str, int]:
    """Get team ids from the database."""
    with get_session() as session:
        return {team.name: team.id for team in session.query(Team).all()}


def get_team_badge_uris(team_ids: dict[str, int]) -> list[dict[str, str]]:
    """Get team badge uris and links for all teams."""
    logger.info("Getting team badge URIs")
    team_badges = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(PREMIER_LEAGUE_CLUBS_URL, wait_until="networkidle")
        page.wait_for_selector("td.team")

        for team_cell in page.query_selector_all("td.team"):
            badge_img = team_cell.query_selector("img.badge-image")
            badge_src = None
            if badge_img:
                srcset = badge_img.get_attribute("srcset")
                if srcset and "@x2" in srcset:
                    badge_src = srcset.split(",")[-1].split()[0].strip()
                else:
                    badge_src = badge_img.get_attribute("src")

            team_name = team_cell.inner_text().strip().replace(" & ", " and ")
            if team_name and badge_src:
                team_id = team_ids.get(team_name)
                if not team_id:
                    logger.warning(
                        f"Team '{team_name}' not found in database, skipping"
                    )
                    continue

                team_badges.append(
                    {
                        "team_id": str(team_id),
                        "team_name": team_name.replace(" ", "-").lower(),
                        "badge_uri": badge_src,
                    }
                )

        browser.close()

    if len(team_badges) != len(team_ids):
        raise ValueError(
            f"Expected {len(team_ids)} team badges, got {len(team_badges)}"
        )

    logger.info(f"Successfully extracted badge URIs for {len(team_badges)} teams")
    return team_badges


def download_badge_images(team_badges: list[dict[str, str]]) -> None:
    """Download badge images from the given URIs."""
    logger.info("Downloading badge images")

    for team in team_badges:
        response = requests.get(team["badge_uri"])
        response.raise_for_status()
        local_path = BADGE_DIR / f"{team['team_name']}.png"

        with open(local_path, "wb") as f:
            f.write(response.content)

    logger.info(f"Successfully downloaded {len(team_badges)} badge images")


def upload_badge_images_to_bucket(team_badges: list[dict[str, str]]) -> None:
    """Upload badge images to Supabase bucket storage."""
    logger.info("Uploading badge images to Supabase")
    supabase_client = get_supabase_client()

    for team in team_badges:
        local_file = BADGE_DIR / f"{team['team_name']}.png"
        bucket_file = f"{team['team_id']}.png"

        with open(local_file, "rb") as f:
            try:
                supabase_client.storage.from_("badges").upload(
                    bucket_file,
                    f,
                    file_options={
                        "content-type": "image/png",
                        "cache-control": "public, max-age=1000000, immutable",
                        "upsert": "true",
                    },
                )
            except Exception as e:
                logger.error(
                    f"Error uploading badge image for {team['team_name']}: {e}"
                )

    logger.info("Successfully uploaded badge images to Supabase")


def make_team_badges_bucket() -> None:
    """Make the team badges bucket."""
    logger.info("Making team badges bucket")
    team_ids = get_team_ids()
    team_badges = get_team_badge_uris(team_ids)
    download_badge_images(team_badges)
    upload_badge_images_to_bucket(team_badges)


if __name__ == "__main__":
    make_team_badges_bucket()
