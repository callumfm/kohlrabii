"""Automates the feature set selection process for a model."""

from __future__ import annotations

import warnings
from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from statsmodels.stats.outliers_influence import variance_inflation_factor

from app.logger import logger
from app.ml.metrics import ScoreMetric
from app.ml.regressor import XGBModel

warnings.filterwarnings(
    "ignore",
    category=RuntimeWarning,
    message="divide by zero encountered in scalar divide",
)

VIF_THRESHOLD: int = 100_000
MAX_FEATURES: int = 30
ERROR_METRIC: ScoreMetric = "mae"
TEST_SET_SIZE: float = 0.25
RANDOM_STATES: list[int] = [0, 420, 666]


@dataclass
class ModelInfo:
    """Store feature selection run model information."""

    features: list[str]
    n_features: int
    stats_train: pd.Series[float]
    stats_test: pd.Series[float]
    trained_model: Any

    @classmethod
    def init_empty(cls) -> ModelInfo:
        """Initialise the dataclass with null values."""
        return cls(
            features=[],
            n_features=0,
            stats_train=pd.Series(dtype="float64"),
            stats_test=pd.Series(dtype="float64"),
            trained_model=None,
        )


def get_low_vif_features(X: pd.DataFrame, threshold: int = VIF_THRESHOLD) -> list[str]:
    """Find features with a low variance inflation factor (multi-collinearity check)."""
    X_scaled = StandardScaler().fit_transform(X.dropna())
    vif: dict[str, float] = {}
    low_vif: list[str] = []
    high_vif: list[str] = []

    for i in range(X.shape[1]):
        feature_vif = variance_inflation_factor(X_scaled, i)
        feature_name = X.columns[i]
        vif[feature_name] = feature_vif
        (low_vif, high_vif)[feature_vif > threshold].append(feature_name)

    msg = f"{len(high_vif)} features found with VIF value > {threshold}: {high_vif}"
    logger.info(msg)

    return low_vif


def remove_low_correlation_features(
    X: pd.DataFrame, y: pd.Series[float | int], max_features: int = MAX_FEATURES
) -> pd.DataFrame:
    """Due to the large number of starting features, the feature selection may
    encounter performance issues and some models suffer from the curse of
    dimensionality. To mitigate this, we begin by filtering out the low
    correlation features as a starting point.
    """
    target = y.name
    df = pd.concat([X, y], axis=1)
    target_corr = df.corr()[target].drop(target)
    abs_target_corr = target_corr.abs().sort_values(ascending=False)
    top_features = abs_target_corr[:max_features].index
    removed_features = list(X.columns[max_features:])
    X_filtered = X[top_features]

    msg = f"{len(removed_features)} features removed with low correlation to target: {removed_features}"
    logger.info(msg)

    return X_filtered


def feature_selection(
    raw_model: XGBModel,
    X: pd.DataFrame,
    y: pd.Series[float | int],
    seeds: list[int] | None = None,
    metric: ScoreMetric = ERROR_METRIC,
) -> ModelInfo:
    """Run all iterations of feature selection.
    Stops when features unchanged between iterations.
    """
    logger.info("Running forward feature selection")
    if seeds is None:
        seeds = RANDOM_STATES

    X_filtered = remove_low_correlation_features(X, y)
    all_features = list(X_filtered.columns)
    best_model_info = ModelInfo.init_empty()
    current_features: list[str] = []

    i = 1
    while True:
        previous_features = current_features.copy()
        viable_features = [f for f in all_features if f not in previous_features]

        if not viable_features:
            break

        candidate_models_info = forward_feature_selection_step(
            raw_model, X_filtered, y, current_features, viable_features, seeds
        )
        best_model_info = select_best_model(
            candidate_models_info, best_model_info, metric
        )
        current_features = best_model_info.features.copy()

        test_set_score = round(getattr(best_model_info.stats_test, metric), 5)
        logger.info(
            f"Total features: {len(current_features)} (test {metric}: {test_set_score})"
        )

        if current_features == previous_features:
            break

        i += 1

    logger.info(f"Selected features: {sorted(best_model_info.features)}")
    return best_model_info


def forward_feature_selection_step(
    raw_model: XGBModel,
    X: pd.DataFrame,
    y: pd.Series[float | int],
    starting_features: list[str],
    viable_features: list[str],
    seeds: list[int],
) -> list[ModelInfo]:
    """Run forwards feature selection iteration."""
    candidate_models_info = []
    for feature in viable_features:
        features = starting_features.copy()
        features += [feature]
        model_info = describe_model(raw_model, features, X, y, seeds)
        candidate_models_info.append(model_info)

    return candidate_models_info


def describe_model(
    raw_model: XGBModel,
    features: list[str],
    X: pd.DataFrame,
    y: pd.Series[float | int],
    seeds: list[int],
) -> ModelInfo:
    """Fit a model on the train data and compute some metrics for evaluation."""
    trained_model = raw_model.fit(X[features], y)
    yhat = raw_model.predict(X[features])
    stats_train = raw_model.compute_metrics(y, yhat).as_series()

    model_info = ModelInfo(
        features=features,
        n_features=len(features),
        stats_train=stats_train,
        stats_test=pd.Series(index=stats_train.index, data=np.nan),
        trained_model=trained_model,
    )
    stats_list = [
        raw_model.fit_predict_score(X[features], y, seed, TEST_SET_SIZE).as_series()
        for seed in seeds
    ]
    model_info.stats_test = pd.concat(stats_list, axis=1).mean(axis=1)
    return model_info


def select_best_model(
    candidate_models_info: list[ModelInfo],
    best_model_info: ModelInfo,
    metric: ScoreMetric = ERROR_METRIC,
) -> ModelInfo:
    """Select the best model out of the current best and all candidate models."""
    candidate_best_score = candidate_models_info[0].stats_test.at[metric]
    best_index = 0

    for index, candidate_model in enumerate(candidate_models_info):
        candidate_score = candidate_model.stats_test.at[metric]
        if _is_improved_score(candidate_best_score, candidate_score, metric):
            candidate_best_score = candidate_score
            best_index = index

    if best_model_info.n_features == 0:
        return candidate_models_info[best_index]

    current_min_score = best_model_info.stats_test.at[metric]
    if _is_improved_score(current_min_score, candidate_best_score, metric):
        best_model_info = candidate_models_info[best_index]

    return best_model_info


def _is_improved_score(
    current_best: float, new_score: float, metric: ScoreMetric
) -> bool:
    """Metrics such as r2 need to be maximised whereas the rest should be minimised."""
    if metric == "r2":
        return new_score > current_best
    return current_best < new_score
