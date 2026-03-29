from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import math

from core.poisson import poisson_distribution
from core.binomial import binomial_distribution
from core.normal import normal_distribution

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalculationRequest(BaseModel):
    n: int
    p: float
    k_start: int
    k_end: int

@app.post("/api/calculate")
def calculate_distributions(req: CalculationRequest):
    lam = req.n * req.p
    mu = lam
    sigma = math.sqrt(req.n * req.p * (1 - req.p))
    
    max_k_sim = int(lam + 4 * sigma) if sigma > 0 else int(lam + 10)
    k_values = list(range(0, max_k_sim + 1))
    
    # Core calculations
    poisson_probs = poisson_distribution(k_values, lam)
    binomial_probs = binomial_distribution(k_values, req.n, req.p)
    
    normal_probs = []
    if req.n > 15 and sigma > 0:
        normal_probs = normal_distribution(k_values, mu, sigma)
        
    # RANGE Logic: sum from k_start to k_end
    s_idx = max(0, min(req.k_start, max_k_sim))
    e_idx = max(s_idx, min(req.k_end, max_k_sim))
    
    exact_range = sum(binomial_probs[s_idx:e_idx + 1])
    poisson_range = sum(poisson_probs[s_idx:e_idx + 1])
    normal_range = sum(normal_probs[s_idx:e_idx + 1]) if normal_probs else None
    
    p_err = abs(exact_range - poisson_range)
    n_err = abs(exact_range - normal_range) if normal_range is not None else None

    return {
        "metrics": {
            "lam": lam,
            "mu": mu,
            "sigma": sigma
        },
        "distributions": {
            "k_values": k_values,
            "binomial": binomial_probs,
            "poisson": poisson_probs,
            "normal": normal_probs
        },
        "insights": {
            "exact_prob": exact_range,
            "poisson_approx": poisson_range,
            "normal_approx": normal_range,
            "poisson_error": p_err,
            "normal_error": n_err
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
