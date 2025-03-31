import pandas as pd


def season_str_to_year(season: str) -> int:
    """Convert season in "1819" format to the year the season started (2018)."""
    return int(f"20{season[:2]}")


def sort_seasons(seasons: list[str], desc: bool = True) -> list[str]:
    """Sort seasons in chronological order."""
    return sorted(seasons, key=season_str_to_year, reverse=desc)


def get_next_season(season: str) -> str:
    """Convert string e.g. '1819' into one for next season, i.e. '1920'."""
    start_year = int(season[:2])
    end_year = int(season[2:])
    next_start_year = (
        f"0{start_year + 1}" if start_year + 1 < 10 else str(start_year + 1)
    )
    next_end_year = f"0{end_year + 1}" if end_year + 1 < 10 else str(end_year + 1)
    return f"{next_start_year}{next_end_year}"


def get_start_end_dates_of_season(season: str) -> list[pd.Timestamp]:
    """
    Obtains rough start and end dates for the season.
    Takes into account the shorter and longer seasons in 19/20 and 20/21.
    """
    start_year = int(f"20{season[:2]}")
    end_year = int(f"20{season[2:]}")
    if season == "1920":
        # regular start, late end to season
        return [pd.Timestamp(2019, 7, 1), pd.Timestamp(2020, 7, 31)]
    elif season == "2021":
        # late start to season, regular end
        return [pd.Timestamp(2020, 8, 1), pd.Timestamp(2021, 6, 30)]
    else:
        # regular season
        return [pd.Timestamp(start_year, 7, 1), pd.Timestamp(end_year, 6, 30)]


def get_previous_season(season: str) -> str:
    """Convert string e.g. '1819' into one for previous season, i.e. '1718'."""
    start_year = int(season[:2])
    end_year = int(season[2:])
    prev_start_year = start_year - 1
    prev_end_year = end_year - 1
    return f"{prev_start_year}{prev_end_year}"


# def get_past_seasons(num_seasons: int) -> list[str]:
#     """Go back num_seasons from the current one."""
#     season = CURRENT_SEASON
#     seasons = []
#     for _ in range(num_seasons):
#         season = get_previous_season(season)
#         seasons.append(season)
#     return seasons
