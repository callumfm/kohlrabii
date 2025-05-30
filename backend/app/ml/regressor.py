"""Model classes for fitting data and making predictions."""

from typing import Any

import pandas as pd
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor

from app.logger import logger
from app.ml.metrics import ScoreMetrics

CV_CONFIG = {
    "cv": 5,
    "n_iter": 10,
    "n_jobs": -1,
    "random_state": 42,
    "param_grid": {
        "max_depth": [300, 400, 600, 800],
        "n_estimators": [2, 3, 4],
        "learning_rate": [0.01, 0.012, 0.014, 0.016],
    },
}


class XGBModel:
    """XGBoost model class."""

    model: XGBRegressor
    verbose: bool = False

    def fit_predict_score(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        seed: int,
        test_size: float,
        tune_hyperparams: bool = False,
    ) -> ScoreMetrics:
        """Fit model, make predictions and return the test set metrics."""
        X_scaled = self.scale_features(X)
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, random_state=seed, test_size=test_size
        )
        self.fit(X_train, y_train, tune_hyperparams=tune_hyperparams)
        yhat_test = self.predict(X_test)
        metrics = self.compute_metrics(y_test, yhat_test)
        return metrics

    def fit(
        self, X_train: pd.DataFrame, y_train: pd.Series, tune_hyperparams: bool = False
    ) -> XGBRegressor:
        """Fit the model."""
        params = self._find_optimal_params(X_train, y_train) if tune_hyperparams else {}
        self.model = XGBRegressor(**params)
        self.model.fit(X_train, y_train)
        return self.model

    def predict(self, X: pd.DataFrame) -> pd.Series:
        """Predict values."""
        yhat = self.model.predict(X)
        return yhat

    @staticmethod
    def _find_optimal_params(
        X_train: pd.DataFrame, y_train: pd.Series
    ) -> dict[str, Any]:
        """Tune model hyperparameters."""
        regressor = XGBRegressor()
        model = RandomizedSearchCV(regressor, **CV_CONFIG)
        model.fit(X_train, y_train)
        logger.info(f"Optimal model params: {model.best_params_}")
        return model.best_params_

    @staticmethod
    def compute_metrics(y: pd.Series, yhat: pd.Series) -> ScoreMetrics:
        """Compute error metrics and scores."""
        return ScoreMetrics.from_predictions(y, yhat)

    @staticmethod
    def scale_features(X: pd.DataFrame) -> pd.DataFrame:
        """Normalize feature values."""
        scaler = StandardScaler()
        X = pd.DataFrame(scaler.fit_transform(X), columns=X.columns).set_index(X.index)
        return X
