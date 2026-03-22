# ML Service

`ml-service/` is a standalone FastAPI microservice that exposes a baseline price prediction endpoint. The baseline is intentionally simple and isolated behind a `PriceRegressor` interface so it can later be replaced with a trained regressor, gradient boosting model, or time-series forecasting pipeline.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## HTTP contract

### `POST /predict-price`

Request body:

```json
{
  "product_id": "sku-123",
  "base_price": 100.0,
  "demand_score": 0.74,
  "competitor_price": 108.5,
  "historical": {
    "recent_prices": [96.0, 98.5, 101.0, 102.0],
    "recent_demands": [0.61, 0.64, 0.69, 0.72],
    "seasonal_indexes": [1.02, 1.05, 1.01]
  }
}
```

Response body:

```json
{
  "predicted_price": 91.3,
  "metadata": {
    "confidence": 0.903,
    "feature_snapshot": {
      "base_price": 100.0,
      "demand_score": 0.74,
      "competitor_price": 108.5,
      "recent_prices": [96.0, 98.5, 101.0, 102.0],
      "recent_demands": [0.61, 0.64, 0.69, 0.72],
      "seasonal_indexes": [1.02, 1.05, 1.01]
    },
    "notes": [
      "Baseline linear regressor with hand-tuned coefficients.",
      "Replace PriceRegressor.predict with a trained regressor or time-series ensemble later."
    ]
  },
  "model_version": "baseline-linear-v1"
}
```

### Notes

- `demand_score` is normalized between `0` and `1`.
- `recent_prices` and `recent_demands` require at least 3 points.
- `seasonal_indexes` supports 1 to 12 values for weekly/monthly seasonality hints.
- FastAPI also serves the OpenAPI contract at `/openapi.json` and interactive docs at `/docs`.
