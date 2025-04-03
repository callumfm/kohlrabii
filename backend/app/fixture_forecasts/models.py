from datetime import date
from typing import TypeAlias

import numpy as np
import pandas as pd
from pydantic import BaseModel

from app.models import KolModel

ForecastResult: TypeAlias = dict[str, dict[date, dict[str, str | float]]]


class TeamModelParams(KolModel):
    """Team model parameters."""

    team: np.ndarray[str]
    attack: np.ndarray[float]
    defence: np.ndarray[float]
    beta_atk: np.ndarray[float] | None
    beta_def: np.ndarray[float] | None
    home_adv: float
    rho: float

    def to_df(self) -> pd.DataFrame:
        """Convert class instance to dataframe."""
        return pd.DataFrame(self.model_dump())


class TeamForecast(BaseModel):
    """Forecast results for a single team."""

    was_home: bool
    win: float
    clean_sheet: float
    goals_for: float
    attack: float
    defence: float

    def __post_init__(self) -> None:
        """Round float fields to 3 decimal places."""
        for field in self.model_fields:
            value = getattr(self, field)
            if isinstance(value, float):
                setattr(self, field, round(value, 3))


class MatchForecast(BaseModel):
    """Forecast results for a single match."""

    home_team: str
    away_team: str
    home_forecast: TeamForecast
    away_forecast: TeamForecast
