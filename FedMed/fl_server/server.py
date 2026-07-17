"""
FedMed Flower Server Entry Point
Listens for gRPC hospital node connections and manages training rounds.
"""

import flwr as fl
from strategy import FedMedEncryptedStrategy

def start_federated_server(port: int = 8080, rounds: int = 10):
    strategy = FedMedEncryptedStrategy(
        fraction_fit=0.8,
        min_fit_clients=2,
        min_available_clients=2,
        use_homomorphic_encryption=True,
        differential_privacy_epsilon=10.0,
    )
    
    print(f"[FedMed FL Server] Starting gRPC Federated Server on port {port} for {rounds} rounds...")
    fl.server.start_server(
        server_address=f"0.0.0.0:{port}",
        config=fl.server.ServerConfig(num_rounds=rounds),
        strategy=strategy,
    )

if __name__ == "__main__":
    start_federated_server()
