import math

def poisson_pmf(k, lam):
    """Compute Poisson probability"""
    return (lam**k * math.exp(-lam)) / math.factorial(k)


def poisson_distribution(k_values, lam):
    """Return list of Poisson probabilities"""
    return [poisson_pmf(k, lam) for k in k_values]