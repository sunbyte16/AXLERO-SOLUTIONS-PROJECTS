# 📝 Changelog

All notable changes to the **FedMed AI Engine** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-07

### 🚀 Added
- **Volumetric 3D U-Net Model**: Implemented deep learning architecture for 3D brain tumor segmentation on multi-modal MRI scans (T1, T1Gd, T2, FLAIR).
- **TenSEAL CKKS Homomorphic Encryption**: Integrated Ring-LWE ciphertext aggregation with polynomial modulus degree $8192$, coefficient bit-sizes `[60, 40, 40, 60]`, and scale $2^{40}$.
- **Differential Privacy Engine (DP-SGD)**: Implemented per-sample $L_2$-norm gradient clipping ($C=1.0$), Gaussian noise injection ($\sigma=1.0$), and dynamic Moments Accountant privacy budget tracking ($\epsilon=3.36 / 10.0, \delta=10^{-5}$).
- **Interactive 3D MRI Canvas Viewer**: Multi-planar reconstruction viewer supporting Axial, Sagittal, and Coronal views, 0–155 slice depth scrolling, AI prediction overlays, and ground-truth comparison.
- **Hospital Silo Node Orchestration**: Node registry with mTLS X.509 SHA-256 certificate validation, GPU VRAM and CPU utilization telemetry (NVIDIA A100/H100/RTX A6000).
- **Google Gemini 2.5 Flash Clinical Assessment**: Integrated generative AI clinical evaluation summarizing segmentation Dice scores, IoU, and privacy assurance.
- **Tamper-Evident Audit Ledger**: SHA-256 chained audit stream tracking mTLS connections, ciphertext updates, and Zero-PHI verification.
- **Full-Stack Presentation Layer**: React 19, TypeScript 5.8, Tailwind CSS v4, Motion animations, Recharts telemetry, and Express API server.
- **Authentication & Multi-Tenant Sessions**: In-memory and disk-persisted SQLite database (`sql.js`), bcrypt password hashing, and JWT bearer/cookie session management.
- **Platform Visual Documentation**: Created high-resolution UI screenshot gallery across all 11 platform sections.

### 🛡️ Security & Compliance
- Full HIPAA Privacy & Security Rule compliance with Zero-PHI egress architecture.
- GDPR Articles 9, 25 (Privacy by Design), and 32 (Security of Processing) assurance.
