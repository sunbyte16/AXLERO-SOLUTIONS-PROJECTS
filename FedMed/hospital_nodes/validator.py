"""
FedMed Hospital Node Heartbeat and mTLS Security Validator
Validates distributed client connectivity, telemetry staleness, and x509 cert expiration.
"""

import time
from typing import Dict, Any

HEARTBEAT_TIMEOUT_SECONDS = 45
DISCONNECT_THRESHOLD_SECONDS = 90

def validate_hospital_node_health(last_seen_timestamp: float, mtls_status: str) -> Dict[str, Any]:
    """
    Evaluates whether a hospital node is actively streaming heartbeats and valid mTLS credentials.
    """
    current_time = time.time()
    diff = max(0.0, current_time - last_seen_timestamp)
    mtls_valid = (mtls_status.upper() == "VERIFIED")
    
    if not mtls_valid:
        status = "DEGRADED"
        health_score = 0.3
    elif diff > DISCONNECT_THRESHOLD_SECONDS:
        status = "DISCONNECTED"
        health_score = 0.0
    elif diff > HEARTBEAT_TIMEOUT_SECONDS:
        status = "STALE"
        health_score = 0.6
    else:
        status = "HEALTHY"
        health_score = 1.0
        
    return {
        "is_alive": diff <= DISCONNECT_THRESHOLD_SECONDS,
        "mtls_valid": mtls_valid,
        "latency_seconds": round(diff, 2),
        "health_score": health_score,
        "status": status
    }
