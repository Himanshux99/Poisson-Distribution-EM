import numpy as np

def run_binomial_simulation(n, p, trials=1000):
    """Monte Carlo simulation"""
    return np.random.binomial(n, p, trials)