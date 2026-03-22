from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="DynaPrice ML Service", version="0.1.0")


class PredictionRequest(BaseModel):
    sku: str
    current_price: float
    inventory_level: int


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "dynaprice-ml"}


@app.get("/health/ready")
def readiness_check() -> dict[str, str]:
    return {"status": "ready", "model": "baseline-pricing-v1"}


@app.post("/predict")
def predict(payload: PredictionRequest) -> dict[str, float | str]:
    recommended_price = round(payload.current_price * 1.05, 2)
    return {
        "sku": payload.sku,
        "recommended_price": recommended_price,
        "model_version": "baseline-pricing-v1",
    }
