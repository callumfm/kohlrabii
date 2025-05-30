"""Compute the total points for a player."""

from dataclasses import dataclass
from typing import Literal


def appearance_points(minutes: float) -> int:
    """Compute the number of appearance points given expected minutes."""
    return 0 if minutes == 0 else 1 if minutes < 60 else 2


@dataclass
class PointMultipliers:
    """Position-wise point multipliers."""

    goal: int
    assist: int
    clean_sheet: int
    goals_conceded: float
    saves: float = 0


POSITION_MULTIPLIERS = {
    "GK": PointMultipliers(
        goal=6, assist=3, goals_conceded=0.5, clean_sheet=4, saves=1 / 3
    ),
    "DEF": PointMultipliers(goal=6, assist=3, goals_conceded=0.5, clean_sheet=4),
    "MID": PointMultipliers(goal=5, assist=3, clean_sheet=1, goals_conceded=0),
    "FWD": PointMultipliers(assist=3, goal=6, clean_sheet=0, goals_conceded=0),
}


def calculate_points(
    position: Literal["GK", "DEF", "MID", "FWD"],
    minutes: float,
    assists: float,
    goals: float,
    bonus: float,
    yellows: float,
    goals_conceded: float = 0,
    clean_sheets: float = 0,
    saves: float = 0,
) -> float:
    """Compute the expected points total for a player."""
    multipliers = POSITION_MULTIPLIERS[position]
    minutes = appearance_points(minutes)
    assists *= multipliers.assist
    goals *= multipliers.goal
    goals_conceded *= multipliers.goals_conceded
    clean_sheets *= multipliers.clean_sheet
    saves *= multipliers.saves
    return (
        minutes
        + assists
        + goals
        + clean_sheets
        + saves
        + bonus
        - goals_conceded
        - yellows
    )
