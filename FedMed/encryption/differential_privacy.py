"""
FedMed Differential Privacy (DP-SGD) Manager
Calculates gradient clipping, Gaussian noise addition, and tracks cumulative privacy budget (epsilon, delta).
"""

import numpy as np
import math
from typing import Dict, Any, Tuple

class DifferentialPrivacyAccountant:
    def __init__(self, target_epsilon: float = 10.0, target_delta: float = 1e-5, clipping_norm: float = 1.0):
        self.target_epsilon = target_epsilon
        self.target_delta = target_delta
        self.clipping_norm = clipping_norm
        self.spent_epsilon = 0.0
        self.spent_delta = 0.0
        self.total_rounds = 0

    def clip_gradients(self, tensor: np.ndarray) -> np.ndarray:
        """Clips tensor gradients to max L2 norm C."""
        l2_norm = np.linalg.norm(tensor)
        if l2_norm > self.clipping_norm:
            scaling_factor = self.clipping_norm / (l2_norm + 1e-6)
            return tensor * scaling_factor
        return tensor

    def add_gaussian_noise(self, tensor: np.ndarray, noise_multiplier: float = 1.0) -> np.ndarray:
        """Adds calibrated Gaussian noise N(0, (sigma * C)^2 I) to clipped gradients."""
        std_dev = noise_multiplier * self.clipping_norm
        noise = np.random.normal(loc=0.0, scale=std_dev, size=tensor.shape)
        return tensor + noise

    def step_round_privacy(self, sample_rate: float, noise_multiplier: float, steps: int = 1) -> Tuple[float, float]:
        """Calculates Privacy Loss for a training round using Moments Accountant approximation."""
        self.total_rounds += 1
        # Approx Moments Accountant per round
        eps_step = (steps * sample_rate * math.sqrt(2 * math.log(1.25 / self.target_delta))) / (noise_multiplier + 1e-5)
        self.spent_epsilon += eps_step
        self.spent_delta = self.target_delta
        return self.spent_epsilon, self.spent_delta

    def is_budget_exhausted(self) -> bool:
        """Checks if accumulated privacy loss exceeds target epsilon."""
        return self.spent_epsilon >= self.target_epsilon
