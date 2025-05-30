"""Create new features from existing ones."""

from collections.abc import Iterable

import numpy as np
import pandas as pd

from app.logger import logger
from app.ml.features.selection import get_low_vif_features
from app.ml.features.store import FEATURE_REGISTRY

MA_WINDOW_SIZE = 5


def get_per90(features_df: pd.DataFrame, minutes_col: str = "minutes") -> pd.DataFrame:
    """Add the per 90 minute (full game) rates of all features."""
    if minutes_col not in features_df:
        raise ValueError(f"{minutes_col} not present in features_df columns!")

    minutes = features_df[minutes_col]
    features = features_df.drop(columns=[minutes_col])
    per90 = {f"{col}_p90": 90 * features_df[col] / minutes for col in features.columns}
    per90_df = pd.DataFrame(per90).replace([np.inf, -np.inf], 0)
    return per90_df


def get_moving_averages(features_df: pd.DataFrame) -> pd.DataFrame:
    """Add the moving average and exponential moving averages for each feature."""
    ma_cols = {}
    for col in features_df.columns:
        ma_cols[f"{col}_{MA_WINDOW_SIZE}ma"] = moving_avg(features_df[col])
        ma_cols[f"{col}_ewm"] = exp_weighted_moving_avg(features_df[col])

    ma_df = pd.DataFrame(ma_cols)
    return ma_df


def exp_weighted_moving_avg(feature: pd.Series) -> pd.Series:
    """Compute the exponential weighted moving average for a feature."""
    return feature.ewm(com=1).mean()


def moving_avg(feature: pd.Series, window: int = MA_WINDOW_SIZE) -> pd.Series:
    """Compute the moving average for a feature."""
    return feature.rolling(window, min_periods=1).mean()


def get_feature_columns(all_columns: Iterable[str], target: str) -> list[str]:
    """Get columns that can be used as valid features."""
    info_cols = [f.name for f in FEATURE_REGISTRY.get_feature_set(info=True)] + [target]
    return [col for col in all_columns if col not in info_cols]


def get_player_features(player_df: pd.DataFrame) -> pd.DataFrame:
    """Run feature engineering pipeline."""
    per90_df = get_per90(player_df)
    ma_df = get_moving_averages(pd.concat([player_df, per90_df], axis=1))
    player_features = (
        pd.concat([player_df, per90_df, ma_df], axis=1).shift(-1).iloc[:-1, :]
    )
    return player_features


def feature_target_split(
    df: pd.DataFrame, target: str
) -> tuple[pd.DataFrame, pd.Series]:
    """Given a raw dataset, split the features and target whilst adding new features."""
    feature_cols = get_feature_columns(df.columns, target)
    logger.info(f"Total features (before feature engineering): {len(feature_cols)}")
    feature_cols_low_vif = get_low_vif_features(df[feature_cols])

    X = df.groupby("master_id")[feature_cols_low_vif].apply(get_player_features)
    y = df.groupby("master_id")[target].apply(lambda x: x.iloc[:-1])
    assert X.shape[0] == y.shape[0], "X and y lengths do not match!"

    logger.info(f"Total features (after feature engineering): {X.shape[1]}")
    return X, y
