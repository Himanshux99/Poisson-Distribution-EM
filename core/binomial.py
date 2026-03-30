from scipy.stats import binom

def binomial_pmf(k, n, p):
    return binom.pmf(k, n, p)

def binomial_distribution(k_values, n, p):
    return [binomial_pmf(k, n, p) for k in k_values]