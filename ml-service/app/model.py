from __future__ import annotations

from dataclasses import dataclass
from statistics import fmean

from .schemas import PredictPriceRequest, PredictPriceResponse, PredictionMetadata


@dataclass(frozen=True)
class ModelArtifacts:
    version: str = "baseline-linear-v1"
    intercept: float = 2.75
    base_price_weight: float = 0.62
    demand_weight: float = 18.0
    competitor_gap_weight: float = 0.21
    recent_price_weight: float = 0.11
    recent_demand_weight: float = 5.0
    seasonality_weight: float = 1.35


class PriceRegressor:
    """Simple baseline regressor interface that can later wrap stronger models."""

    def __init__(self, artifacts: ModelArtifacts | None = None) -> None:
        self.artifacts = artifacts or ModelArtifacts()

    def predict(self, request: PredictPriceRequest) -> PredictPriceResponse:
        historical = request.historical
        average_recent_price = fmean(historical.recent_prices)
        average_recent_demand = fmean(historical.recent_demands)
        average_seasonality = fmean(historical.seasonal_indexes)
        competitor_gap = request.competitor_price - request.base_price

        raw_price = (
            self.artifacts.intercept
            + (request.base_price * self.artifacts.base_price_weight)
            + (request.demand_score * self.artifacts.demand_weight)
            + (competitor_gap * self.artifacts.competitor_gap_weight)
            + (average_recent_price * self.artifacts.recent_price_weight)
            + (average_recent_demand * self.artifacts.recent_demand_weight)
            + (average_seasonality * self.artifacts.seasonality_weight)
        )
        predicted_price = round(max(raw_price, request.base_price * 0.5), 2)

        demand_stability = 1 - min(abs(request.demand_score - average_recent_demand), 1)
        price_stability = 1 - min(
            abs(request.competitor_price - average_recent_price) / max(request.competitor_price, 1),
            1,
        )
        confidence = round(max(min((demand_stability + price_stability) / 2, 0.99), 0.15), 3)

        metadata = PredictionMetadata(
            confidence=confidence,
            feature_snapshot={
                "base_price": request.base_price,
                "demand_score": request.demand_score,
                "competitor_price": request.competitor_price,
                "recent_prices": historical.recent_prices,
                "recent_demands": historical.recent_demands,
                "seasonal_indexes": historical.seasonal_indexes,
            },
            notes=[
                "Baseline linear regressor with hand-tuned coefficients.",
                "Replace PriceRegressor.predict with a trained regressor or time-series ensemble later.",
            ],
        )
        return PredictPriceResponse(
            predicted_price=predicted_price,
            metadata=metadata,
            model_version=self.artifacts.version,
        )
