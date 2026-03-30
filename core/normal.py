from scipy.stats import norm

def normal_pmf_discrete(k, mu, sigma):
    """Discrete approximation using continuity correction"""
    return norm.cdf(k + 0.5, mu, sigma) - norm.cdf(k - 0.5, mu, sigma)


def normal_distribution(k_values, mu, sigma):
    """Return list of Normal approximations"""
    return [normal_pmf_discrete(k, mu, sigma) for k in k_values]


def normal_pdf_curve(x_values, mu, sigma):
    """Smooth curve for graph"""
    return norm.pdf(x_values, mu, sigma)