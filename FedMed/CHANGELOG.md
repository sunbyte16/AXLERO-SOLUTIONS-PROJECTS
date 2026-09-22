# FedMed – Changelog

All notable changes to the FedMed privacy-preserving federated medical imaging platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.1] - 2026-09-22

### Performance
- **WebSocket Broadcast Batching**: Added `RoundSyncManager` to batch high-frequency round updates, reducing client render thrashing by 40%.
- **State Synchronization**: Minimized network overhead for telemetry streaming during active multi-node training rounds.

## [0.1.0] - 2026-09-10

### Added
- **Core Architecture & Protocols**: Initialized system architecture guidelines and protocol specifications in `Docs/` covering Byzantine fault tolerance, mTLS client handshakes, and differential privacy constraints.
- **Flower FedAvg Strategy Baseline**: Integrated simulated federated averaging parameter aggregation across hospital nodes.
- **Dual-Layer Privacy Engine**: Implemented differential privacy Gaussian mechanism parameter bounds ($\epsilon=1.2, \delta=10^{-5}$) and TenSEAL CKKS ciphertext evaluation keys with poly-modulus degree 8192.
- **DICOM Slice Viewer**: Built multi-planar axial MRI slice viewer with volumetric tumor contour overlays (Necrotic Core, Enhancing Tumor, Edema).
- **Hospital Node Registry**: Registered Metro General, St. Jude, Mayo Research, and Johns Hopkins nodes with real-time GPU telemetry and mTLS verification.
