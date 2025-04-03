"""Dixon-Coles team strength model."""

import warnings
from collections.abc import Callable
from datetime import datetime

import numpy as np
from numba import njit, vectorize
from scipy.optimize import OptimizeResult, minimize

from app.fixture_forecasts.models import MatchForecast, TeamForecast, TeamModelParams
from app.logger import logger


class DixonColesModel:
    """Dixon Coles team strength model."""

    max_iter: int = 100
    xi: float = 0.001

    def __init__(
        self,
        home_team: np.ndarray[str],
        away_team: np.ndarray[str],
        home_goals: np.ndarray[int],
        away_goals: np.ndarray[int],
        date: np.ndarray[datetime.date],
        covariates: np.ndarray[float] | None = None,
    ):
        """Initialise model with fixtures and team-level covariates."""
        self.home_teams = home_team
        self.away_teams = away_team
        self.home_goals = home_goals
        self.away_goals = away_goals

        self.weights = time_decay(date, xi=self.xi)

        self.teams = np.unique(np.concatenate((self.home_teams, self.away_teams)))
        self.n_teams = len(self.teams)

        self.covariates = covariates
        if self.covariates is not None and self.covariates.shape[0] != self.n_teams:
            raise ValueError("Shape of covariates must match n teams")

        self._params: np.ndarray = self._init_params()
        self._res: OptimizeResult | None = None
        self.loglikelihood: float | None = None
        self.aic: float | None = None
        self.n_params: int | None = None
        self.fitted: bool = False

    def _init_params(self) -> np.ndarray[int | float]:
        """Initialise empty parameters."""
        team_atk = [1] * self.n_teams
        team_def = [-1] * self.n_teams
        home_adv = [0.25]
        rho = [-0.1]

        if self.covariates is None:
            return np.concatenate((team_atk, team_def, home_adv, rho))

        beta_att = [0] * self.n_teams
        beta_def = [0] * self.n_teams
        return np.concatenate((team_atk, team_def, beta_att, beta_def, home_adv, rho))

    @property
    def constraints(self) -> dict[str, str | Callable]:
        """Define objective function."""
        return {"type": "eq", "fun": lambda x: sum(x[: self.n_teams]) - self.n_teams}

    @property
    def bounds(self) -> list[tuple[int, int]]:
        """Define parameter bounds."""
        team_atk = [(0, 3)] * self.n_teams
        team_def = [(-3, 0)] * self.n_teams
        home_adv = [(0, 2)]
        rho = [(-2, 2)]

        if self.covariates is None:
            return team_atk + team_def + home_adv + rho

        return team_atk + team_def + team_atk + team_def + home_adv + rho

    def fit(self) -> None:
        """Fits the model to the data, calculating the team strengths, home advantage and intercept."""
        logger.info("Fitting model")

        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", category=RuntimeWarning)
            self._res = minimize(
                fun=self._fit_step,
                x0=self._params,
                constraints=self.constraints,
                bounds=self.bounds,
                options={"maxiter": self.max_iter, "disp": False},
            )

        if not self._res.success:
            raise ValueError("Optimization did not converge")

        self._params = self._res["x"]
        self.n_params = len(self._params)
        self.loglikelihood = float(self._res["fun"] * -1)
        self.aic = -2 * self.loglikelihood + 2 * self.n_params
        self.fitted = True

        logger.info(f"Model successfully fitted (AIC: {self.aic:.2f})")

    def _fit_step(self, params: np.array) -> float:
        """Model fit iteration."""
        params = self.get_model_params(params)

        home_team_indices = np.searchsorted(params.team, self.home_teams)
        away_team_indices = np.searchsorted(params.team, self.away_teams)

        home_atk = params.attack[home_team_indices]
        home_def = params.defence[home_team_indices]
        away_atk = params.attack[away_team_indices]
        away_def = params.defence[away_team_indices]

        home_exp = np.exp(params.home_adv + home_atk + away_def)
        away_exp = np.exp(away_atk + home_def)

        home_llk = poisson_logpmf(self.home_goals, home_exp)
        away_llk = poisson_logpmf(self.away_goals, away_exp)

        dc_adj = rho_correction(
            self.home_goals, self.away_goals, home_exp, away_exp, params.rho
        )
        llk = (home_llk + away_llk + np.log(dc_adj)) * self.weights

        return -np.sum(llk)

    def predict(self, home_team: str, away_team: str) -> MatchForecast:
        """Predicts the probabilities of the different possible match outcomes."""
        if not self.fitted:
            raise ValueError(
                "Model params not fitted, please call `fit()` before predicting values"
            )

        params = self.get_model_params()
        home_atk, home_def = self.get_team_strength(home_team)
        away_atk, away_def = self.get_team_strength(away_team)
        home_goal_exp, away_goal_exp = expected_goals(
            home_atk, away_atk, home_def, away_def, params.home_adv
        )

        m = joint_probability_matrix(home_goal_exp, away_goal_exp)
        m = low_scoreline_correction(m, home_goal_exp, away_goal_exp, params.rho)

        results = MatchForecast(
            home_team=home_team,
            away_team=away_team,
            home_forecast=TeamForecast(
                was_home=True,
                win=np.sum(np.tril(m, -1)),
                clean_sheet=m[:, 0].sum(),
                goals_for=home_goal_exp,
                attack=home_atk,
                defence=home_def,
            ),
            away_forecast=TeamForecast(
                was_home=False,
                win=np.sum(np.triu(m, 1)),
                clean_sheet=m[0, :].sum(),
                goals_for=away_goal_exp,
                attack=away_atk,
                defence=away_def,
            ),
        )

        return results

    def evaluate(
        self,
        home_team: np.ndarray[str],
        away_team: np.ndarray[str],
        home_goals: np.ndarray[int],
        away_goals: np.ndarray[int],
    ) -> float:
        """Evaluate the performance of the fitted model against a test set."""
        preds = np.array(
            [
                self.predict(home, away)
                for home, away in zip(home_team, away_team, strict=False)
            ]
        )

        home_preds = np.array([p.home_forecast.goals_for for p in preds])
        away_preds = np.array([p.away_forecast.goals_for for p in preds])

        home_errors = np.abs(home_goals - home_preds)
        away_errors = np.abs(away_goals - away_preds)

        mae = np.mean((home_errors + away_errors) / 2)
        logger.info(f"MAE: {mae:.3f}")
        return mae

    def get_model_params(
        self, params_list: np.ndarray[float] | None = None
    ) -> TeamModelParams:
        """Labelled parameters dictionary."""
        params_list = params_list if params_list is not None else self._params
        params: TeamModelParams = TeamModelParams(
            team=self.teams,
            attack=params_list[: self.n_teams],
            defence=params_list[self.n_teams : 2 * self.n_teams],
            beta_atk=None,
            beta_def=None,
            home_adv=params_list[-2],
            rho=params_list[-1],
        )

        if self.covariates is not None:
            params.beta_atk = params_list[-(2 + self.n_teams * 2) : -(2 + self.n_teams)]
            params.beta_def = params_list[-(2 + self.n_teams) : -2]
            params = self._adjust_covariate_strengths(params)

        return params

    def get_all_team_strengths(self) -> dict[str, dict[str, float]]:
        """Get a dictionary of team to attack and defence strengths as fitted by the model."""
        return {
            team: {"attack": self._params[i], "defence": self._params[i + self.n_teams]}
            for i, team in enumerate(self.teams)
        }

    def get_team_strength(self, team: str) -> tuple[float, float]:
        """Get the attack and defence strength for a single team."""
        all_strengths = self.get_all_team_strengths()
        if team not in all_strengths:
            return self._new_team_strength()

        team_atk, team_def = all_strengths[team].values()
        return team_atk, team_def

    def _new_team_strength(self) -> tuple[float, float]:
        """Approximation of team strengths for unseen teams."""
        # TODO: Use covariate priors e.g. FIFA ratings
        n_teams = len(self.teams)
        attack = sorted(self._params[:n_teams])
        defence = sorted(self._params[n_teams : 2 * n_teams])
        mean_atk = np.percentile(attack, 0.4)
        mean_def = np.percentile(defence, 0.4)
        return mean_atk, mean_def

    def _adjust_covariate_strengths(self, params: TeamModelParams) -> TeamModelParams:
        """Adjust strengths based on covariates."""
        if self.covariates is None:
            return params

        params_df = params.to_df()
        teams = params_df["team"].unique()
        for team in teams:
            beta_atk = params_df.loc[params_df.team == team, "beta_atk"]
            beta_def = params_df.loc[params_df.team == team, "beta_def"]
            params_df.loc[params_df.team == team, "attack"] += np.dot(
                self.covariates[team], beta_atk
            )
            params_df.loc[params_df.team == team, "defence"] += np.dot(
                self.covariates[team], beta_def
            )

        return TeamModelParams(**params_df.to_dict())


@njit
def rho_correction(
    home_goals: list[int],
    away_goals: list[int],
    home_exp: list[float],
    away_exp: list[float],
    rho: float,
) -> np.array:
    """Vectorized rho correction."""
    corrections = np.ones_like(home_goals, dtype=np.float64)
    mask_00 = (home_goals == 0) & (away_goals == 0)
    mask_01 = (home_goals == 0) & (away_goals == 1)
    mask_10 = (home_goals == 1) & (away_goals == 0)
    mask_11 = (home_goals == 1) & (away_goals == 1)

    corrections[mask_00] = 1 - (home_exp[mask_00] * away_exp[mask_00] * rho)
    corrections[mask_01] = 1 + (home_exp[mask_01] * rho)
    corrections[mask_10] = 1 + (away_exp[mask_10] * rho)
    corrections[mask_11] = 1 - rho

    return corrections


@njit
def low_scoreline_correction(
    m: np.ndarray[float], home_goal_exp: float, away_goal_exp: float, rho: float
) -> np.ndarray[float]:
    """Dixon-Coles low score correction e.g. 0-0, 0-1, 1-0, 1-1."""
    m[0, 0] *= 1 - home_goal_exp * away_goal_exp * rho
    m[0, 1] *= 1 + home_goal_exp * rho
    m[1, 0] *= 1 + home_goal_exp * rho
    m[1, 1] *= 1 - rho
    return m


def time_decay(dates: np.ndarray[datetime.date], xi: float) -> np.ndarray[float]:
    """Exponentially decay fixtures so that old ones influence the current strength less."""
    return np.exp(-xi * (dates.max() - dates).astype(int))


@njit
def stirling_gammaln(n: int) -> float:
    """Stirling's approximation for gammaln."""
    return n * np.log(n) - n + 0.5 * np.log(2 * np.pi * n)


@vectorize(["float64(int64, float64)"])
def poisson_logpmf(k: int, mu: float) -> float:
    """Fast Poisson log-PMF using Stirling's approximation for gammaln."""
    return k * np.log(mu) - stirling_gammaln(k + 1) - mu


@njit
def joint_probability_matrix(
    home_goal_exp: float, away_goal_exp: float, max_goals: int = 7
) -> np.ndarray[float]:
    """Build the joint score probability matrix."""
    gammaln = stirling_gammaln(np.arange(max_goals) + 1)
    goals = np.arange(max_goals)
    home_probs = np.exp(-home_goal_exp + goals * np.log(home_goal_exp) - gammaln)
    away_probs = np.exp(-away_goal_exp + goals * np.log(away_goal_exp) - gammaln)
    return np.outer(home_probs, away_probs)


@njit
def expected_goals(
    home_atk: float, away_atk: float, home_def: float, away_def: float, rho: float
) -> tuple[float, float]:
    """Get the home and away goal expectation."""
    home_goal_exp = np.exp(home_atk + away_def + rho)
    away_goal_exp = np.exp(away_atk + home_def)
    return home_goal_exp, away_goal_exp
