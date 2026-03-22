from fastapi import FastAPI

from .model import PriceRegressor
from .schemas import PredictPriceRequest, PredictPriceResponse

app = FastAPI(
    title="DynaPrice ML Service",
    version="0.1.0",
    description="Price prediction microservice with a swappable baseline regression model.",
)

regressor = PriceRegressor()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "model_version": regressor.artifacts.version}


@app.post("/predict-price", response_model=PredictPriceResponse)
def predict_price(payload: PredictPriceRequest) -> PredictPriceResponse:
    return regressor.predict(payload)
