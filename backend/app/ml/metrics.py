from __future__ import annotations

import math
from dataclasses import asdict, dataclass
from typing import Literal, TypeAlias

import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

ScoreMetric: TypeAlias = Literal["mae", "mse", "rmse", "r2"]


@dataclass
class ScoreMetrics:
    """Error metrics to compare outputs."""

    mae: float
    mse: float
    rmse: float
    r2: float

    @classmethod
    def from_predictions(
        cls, y: pd.Series[float | int], yhat: pd.Series[float | int]
    ) -> ScoreMetrics:
        """Compute the score metrics given a model prediction."""
        return cls(
            mae=mean_absolute_error(y, yhat),
            mse=mean_squared_error(y, yhat),
            rmse=math.sqrt(mean_squared_error(y, yhat)),
            r2=r2_score(y, yhat),
        )

    def as_series(self) -> pd.Series[float]:
        """Return the class as a pandas series."""
        return pd.Series(asdict(self), dtype=float)

    def __str__(self) -> str:
        """String representation stores values in a formatted table."""
        table = [
            ["Metric", "Score"],
            ["Mean Absolute Error (MAE)", str(self.mae)],
            ["Mean Squared Error (MSE)", str(self.mse)],
            ["Root Mean Squared Error (RMSE)", str(self.rmse)],
            ["R-Squared (r2)", str(self.r2)],
        ]
        return "/n".join([", ".join(row) for row in table])
