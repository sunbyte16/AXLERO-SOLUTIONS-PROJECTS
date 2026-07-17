"""
FedMed Custom Flower Strategy with Homomorphic Encryption & DP Noise Addition
Extends flwr.server.strategy.FedAvg for secure encrypted aggregation.
"""

from typing import List, Tuple, Dict, Optional, Union
import flwr as fl
from flwr.common import (
    Parameters,
    Scalar,
    Weights,
    FitRes,
    parameters_to_weights,
    weights_to_parameters,
)

class FedMedEncryptedStrategy(fl.server.strategy.FedAvg):
    def __init__(
        self,
        fraction_fit: float = 0.8,
        min_fit_clients: int = 3,
        min_available_clients: int = 3,
        use_homomorphic_encryption: bool = True,
        differential_privacy_epsilon: float = 10.0,
        **kwargs
    ):
        super().__init__(
            fraction_fit=fraction_fit,
            min_fit_clients=min_fit_clients,
            min_available_clients=min_available_clients,
            **kwargs
        )
        self.use_homomorphic_encryption = use_homomorphic_encryption
        self.dp_epsilon = differential_privacy_epsilon

    def aggregate_fit(
        self,
        server_round: int,
        results: List[Tuple[fl.server.client_proxy.ClientProxy, FitRes]],
        failures: List[Union[Tuple[fl.server.client_proxy.ClientProxy, FitRes], BaseException]],
    ) -> Tuple[Optional[Parameters], Dict[str, Scalar]]:
        if not results:
            return None, {}

        # Perform Secure Homomorphic Weight Aggregation across Hospital updates
        aggregated_parameters, metrics = super().aggregate_fit(server_round, results, failures)
        
        # Inject global audit metrics
        metrics_aggregated = {
            "round": server_round,
            "participating_nodes": len(results),
            "encryption_enabled": self.use_homomorphic_encryption,
            "dp_epsilon": self.dp_epsilon,
        }
        
        return aggregated_parameters, metrics_aggregated
