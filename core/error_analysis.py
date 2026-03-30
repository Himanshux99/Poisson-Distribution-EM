import numpy as np

def calculate_error(actual, approx):
    """Absolute error"""
    return np.abs(np.array(actual) - np.array(approx))


def average_error(actual, approx):
    """Mean error"""
    return np.mean(calculate_error(actual, approx))