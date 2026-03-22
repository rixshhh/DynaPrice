from typing import List

from pydantic import BaseModel, Field, conlist


class HistoricalFeatures(BaseModel):
    recent_prices: conlist(float, min_length=3, max_length=30) = Field(
        ...,
        description="Recent observed selling prices ordered from oldest to newest.",
    )
    recent_demands: conlist(float, min_length=3, max_length=30) = Field(
        ...,
        description="Recent demand scores aligned with recent_prices.",
    )
    seasonal_indexes: conlist(float, min_length=1, max_length=12) = Field(
        ...,
        description="Seasonality multipliers such as weekly or monthly trend indexes.",
    )


class PredictPriceRequest(BaseModel):
    product_id: str = Field(..., description="Stable product identifier.")
    base_price: float = Field(..., gt=0, description="Catalog or floor price for the item.")
    demand_score: float = Field(
        ...,
        ge=0,
        le=1,
        description="Normalized demand score between 0 and 1.",
    )
    competitor_price: float = Field(
        ...,
        gt=0,
        description="Latest competitor market price for a similar item.",
    )
    historical: HistoricalFeatures


class PredictionMetadata(BaseModel):
    confidence: float = Field(..., ge=0, le=1)
    feature_snapshot: dict[str, float | List[float]]
    notes: list[str]


class PredictPriceResponse(BaseModel):
    predicted_price: float = Field(..., gt=0)
    metadata: PredictionMetadata
    model_version: str
