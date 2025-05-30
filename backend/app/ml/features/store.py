"""Schemas: column name, dtype and classification mappings for all features."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Feature:
    """Modelling feature."""

    name: str
    dtype: type
    raw_name: str | None = None
    outfielders: bool = False
    goalkeepers: bool = False
    results: bool = False
    info: bool = False

    def __post_init__(self) -> None:
        """Post initialisation validation and add feature to the registry."""
        if not any((self.outfielders, self.goalkeepers, self.results)):
            raise ValueError(
                "Must set one of outfielders, goalkeepers, results to True!"
            )

        if self.raw_name is None:
            self.raw_name = self.name

        FEATURE_REGISTRY.add_feature(self)

    def __hash__(self) -> int:
        """Allows columns to be filtered directly."""
        return hash(self.name)


class FeatureRegistry:
    """Registry to manage and retrieve features."""

    def __init__(self) -> None:
        """Initialise registry."""
        self._registry: list[Feature] = []

    def add_feature(self, feature: Feature) -> None:
        """Add a feature to the registry."""
        if feature not in self._registry:
            self._registry.append(feature)

    def get_feature_set(
        self,
        outfielders: bool = False,
        goalkeepers: bool = False,
        results: bool = False,
        info: bool = False,
    ) -> list[Feature]:
        """Retrieve features based on provided arguments."""
        filters: dict[str, bool | str] = {
            k: v for k, v in locals().items() if v is True
        }
        return [
            feature
            for feature in self._registry
            if all(getattr(feature, key) == value for key, value in filters.items())
        ]

    def get_all_features(self) -> list[Feature]:
        """Retrieve all features."""
        return list(self._registry)


FEATURE_REGISTRY = FeatureRegistry()

# Shared features
Feature("date", str, outfielders=True, goalkeepers=True, results=True, info=True)
Feature("team", str, raw_name="squad", outfielders=True, goalkeepers=True, info=True)
Feature("venue", str, results=True, info=True)

Feature("xg", float, outfielders=True, results=True)
Feature("npxg", float, outfielders=True, results=True)
Feature("shots", int, raw_name="sh", outfielders=True, results=True)
Feature("shots_ot", int, raw_name="sot", outfielders=True, results=True)
Feature("pk_scored", int, raw_name="pk", outfielders=True, results=True)

# results features
Feature("gf", int, results=True)
Feature("ga", int, results=True)
Feature("opponent", str, results=True)
Feature("shots_dist", float, raw_name="dist", results=True)

# Player information features
Feature("master_id", int, outfielders=True, goalkeepers=True, info=True)
Feature("full_name", str, outfielders=True, goalkeepers=True, info=True)
Feature("season", str, outfielders=True, goalkeepers=True, info=True)
Feature("position", str, outfielders=True, goalkeepers=True, info=True)
Feature(
    "element", int, raw_name="fpl_id", outfielders=True, goalkeepers=True, info=True
)
Feature("round", int, outfielders=True, goalkeepers=True, info=True)
Feature("opponent_team", str, outfielders=True, goalkeepers=True, info=True)
Feature("was_home", bool, outfielders=True, goalkeepers=True, info=True)
Feature("value", float, outfielders=True, goalkeepers=True, info=True)

# Player non-info features
Feature("minutes", int, outfielders=True, goalkeepers=True)
Feature("total_points", int, outfielders=True, goalkeepers=True)
Feature("clean_sheets", int, outfielders=True, goalkeepers=True)
Feature("bps", int, outfielders=True, goalkeepers=True)
Feature("yellow_cards", int, outfielders=True, goalkeepers=True)
Feature("red_cards", int, outfielders=True, goalkeepers=True)
Feature("transfers_balance", int, outfielders=True, goalkeepers=True)

# outfielders features
Feature("assists", int, outfielders=True)
Feature("goals_scored", int, outfielders=True)
Feature("goals_conceded", int, outfielders=True)
Feature("ict_index", float, outfielders=True)
Feature("influence", float, outfielders=True)
Feature("creativity", float, outfielders=True)
Feature("threat", float, outfielders=True)

Feature("pk_att", int, raw_name="pkatt", outfielders=True)
Feature("tackles", int, raw_name="tkl", outfielders=True)
Feature("interceptions", int, raw_name="int", outfielders=True)
Feature("touches", int, outfielders=True)
Feature("blocks", int, outfielders=True)
Feature("xa", float, raw_name="xag", outfielders=True)
Feature("shot_creating_actions", int, raw_name="sca", outfielders=True)
Feature("goal_creating_actions", int, raw_name="gca", outfielders=True)
Feature("pass_completed", int, raw_name="cmp", outfielders=True)
Feature("pass_att", int, raw_name="passes_att", outfielders=True)
Feature("pass_%", float, raw_name="cmp%", outfielders=True)
Feature("pass_prog", int, raw_name="prgp", outfielders=True)
Feature("carries", int, raw_name="carries", outfielders=True)
Feature("carries_prog", int, raw_name="prgc", outfielders=True)
Feature("take_on_att", int, raw_name="take-ons_att", outfielders=True)
Feature("take_on_success", int, raw_name="succ", outfielders=True)

# goalkeepers features
Feature("penalties_saved", int, goalkeepers=True)
Feature("goals_conceded", int, goalkeepers=True)
Feature("influence", float, goalkeepers=True)
Feature("saves", int, goalkeepers=True)

Feature("shots_ot_against", int, raw_name="sota", goalkeepers=True)
Feature("save_%", float, raw_name="save%", goalkeepers=True)
Feature("psxg", float, goalkeepers=True)
Feature("pk_faced", int, raw_name="pkatt", goalkeepers=True)
Feature("pk_saved", int, raw_name="pksv", goalkeepers=True)
Feature("long_pass_comp%", float, raw_name="cmp%", goalkeepers=True)
Feature("pass_avglen", float, raw_name="passes_avglen", goalkeepers=True)
Feature("cross_stp%", float, raw_name="stp%", goalkeepers=True)
