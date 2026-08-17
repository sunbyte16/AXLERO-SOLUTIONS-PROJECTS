# FedMed

<div align="center">

### Privacy-Preserving Medical Federated Learning Platform

Collaborative 3D MRI brain tumor segmentation across multi-hospital networks with zero patient data leakage.

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#tech-stack)
[![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20gRPC-3776AB?style=for-the-badge&logo=python&logoColor=white)](#tech-stack)
[![FL Engine](https://img.shields.io/badge/FL%20Engine-Flower%20(FL)-FF6F00?style=for-the-badge)](#architecture)
[![Model](https://img.shields.io/badge/Model-3D%20U--Net-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](#architecture)
[![Encryption](https://img.shields.io/badge/Privacy-TenSEAL%20%7C%20HE-10B981?style=for-the-badge)](#features)
[![Compliance](https://img.shields.io/badge/Compliance-HIPAA%20%7C%20GDPR-00C853?style=for-the-badge)](#features)
[![Deployment](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#quick-start)

[![GitHub](https://img.shields.io/badge/GitHub-sunbyte16-181717?style=flat-square&logo=github)](https://github.com/sunbyte16)
[![GitHub](https://img.shields.io/badge/GitHub-ymp7-181717?style=flat-square&logo=github)](https://github.com/ymp7)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sunil%20Sharma-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sunil-kumar-bb88bb31a/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Monish%20Prasanna-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yegireddy-monish-prasanna/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit%20Site-7C3AED?style=flat-square&logo=netlify&logoColor=white)](https://lively-dodol-cc397c.netlify.app)

</div>

**FedMed** is an enterprise-grade, privacy-first Federated Learning platform engineered for collaborative medical imaging and volumetric 3D MRI brain tumor segmentation. By sending the AI model to hospital nodes rather than centralizing patient records, FedMed enables multi-institutional diagnostic research while maintaining strict HIPAA and GDPR compliance with mathematical zero-data-leakage guarantees.

It combines:

- Decentralized Federated Averaging (FedAvg) over gRPC with mTLS
- Volumetric 3D U-Net neural network architecture for brain tumor segmentation
- Dual-layer privacy: Calibrated Differential Privacy + TenSEAL Homomorphic Encryption
- Interactive WebGL 3D MRI multi-planar slice reconstruction viewer
- Byzantine-resilient node synchronization and immutable audit logs

## Features

- **Decentralized Multi-Hospital Training**: orchestrates federated training rounds across distributed hospital nodes (Metro General, St. Jude, Mayo Research, Johns Hopkins).
- **Dual-Layer Privacy Engine**:
  - *Differential Privacy (DP)*: Injects calibrated Gaussian noise (ε=1.2, δ=10⁻⁵) to prevent model inversion and membership inference attacks.
  - *Homomorphic Encryption (HE)*: Uses Paillier and TenSEAL encrypted gradient aggregation so the central aggregator never decrypts individual weights.
- **Interactive 3D MRI Viewer**: real-time axial, sagittal, and coronal volumetric slice navigation with tumor contour overlays (Necrotic Core, Enhancing Tumor, Edema).
- **Byzantine Fault Tolerance**: outlier client weight filtering and dynamic node reputation scoring.
- **Enterprise Regulatory Compliance**: immutable audit trails designed to meet HIPAA Security Rules (45 CFR § 164.312) and GDPR Article 25.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, WebGL, Lucide Icons |
| Backend & FL | Python 3.10+, Flower (FL), PyTorch, gRPC, Protocol Buffers |
| Cryptography & Privacy | TenSEAL, Paillier Homomorphic Encryption, PyVenn, NumPy |
| Database & State | SQLite, Express API gateway, WebSocket telemetry |
| DevOps | Docker, Docker Compose |

## Architecture

```text
                           FEDMED PLATFORM ARCHITECTURE

                            +----------------------+
                            |   Central FL Server  |
                            | Federated Aggregator |
                            +----------+-----------+
                                       |
                   Encrypted Weights   |   gRPC / mTLS
                   Homomorphic Agg     |   Global Model Broadcast
                                       v
+-------------------------------------------------------------------------------+
|                            FEDERATED CLIENT NODES                             |
|                                                                               |
|  +--------------------+  +--------------------+  +--------------------+       |
|  |  Hospital Node A   |  |  Hospital Node B   |  |  Hospital Node C   |  ...  |
|  |  Local MRI Dataset |  |  Local MRI Dataset |  |  Local MRI Dataset |       |
|  |  (Behind Firewall) |  |  (Behind Firewall) |  |  (Behind Firewall) |       |
|  +---------+----------+  +---------+----------+  +---------+----------+       |
|            |                       |                       |                  |
|            v                       v                       v                  |
|  +--------------------------------------------------------------------+       |
|  |                     Local 3D U-Net Training Engine                 |       |
|  |  • PyTorch Volumetric Convolutional Layers                         |       |
|  |  • Differential Privacy Perturbation Engine (Gaussian Noise)       |       |
|  |  • TenSEAL Homomorphic Encryption Context                          |       |
|  +--------------------------------------------------------------------+       |
+--------------------------------------+----------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                       WEBGL 3D MRI DIAGNOSTIC CLIENT                          |
|                                                                               |
|  • Axial / Sagittal / Coronal Multi-Planar Slice Reconstruction               |
|  • Real-Time Segmentation Mask Contours (Dice Score: 0.901+)                  |
|  • Live Federated Round Telemetry & HIPAA Audit Logs                          |
+-------------------------------------------------------------------------------+
```

### System Flow

```mermaid
flowchart TD
    S[Central FL Server] -->|1. Broadcast Global Weights| N1[Hospital Node 1]
    S -->|1. Broadcast Global Weights| N2[Hospital Node 2]
    S -->|1. Broadcast Global Weights| N3[Hospital Node 3]

    N1 -->|2. Local 3D U-Net Train + DP| E1[TenSEAL Encrypted Gradient 1]
    N2 -->|2. Local 3D U-Net Train + DP| E2[TenSEAL Encrypted Gradient 2]
    N3 -->|2. Local 3D U-Net Train + DP| E3[TenSEAL Encrypted Gradient 3]

    E1 -->|3. Secure Aggregation| AGG[Homomorphic FedAvg Engine]
    E2 -->|3. Secure Aggregation| AGG
    E3 -->|3. Secure Aggregation| AGG

    AGG -->|4. Updated Global Model| S
    S -->|5. Telemetry Stream| UI[React 18 / WebGL Dashboard]
```

### Request & Round Lifecycle

```mermaid
sequenceDiagram
    participant S as Central FL Server
    participant H as Hospital Nodes
    participant DP as Privacy Engine
    participant UI as Diagnostic Dashboard

    S->>H: Initiate Round N with current global weights
    H->>H: Train local 3D U-Net on private MRI slices
    H->>DP: Apply Differential Privacy (Gaussian noise)
    DP->>H: Encrypt gradients with TenSEAL HE
    H->>S: Return encrypted weight updates (Zero Patient Data)
    S->>S: Homomorphic Aggregation (FedAvg)
    S->>UI: Stream new Mean Dice Score (0.901+) & Round Metrics
    UI->>UI: Update 3D MRI Tumor Segmentation Overlay
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.10+
- PyTorch with CUDA (optional for GPU acceleration)

### 1. Configure Environment

```bash
cp .env.example .env
```

### 2. Start the Development Engine & Dashboard

```bash
# Install dependencies
npm install

# Launch FedMed Engine and UI
npm run dev
```

The application will be accessible at:
- **Web UI & 3D Viewer**: `http://localhost:3000`
- **Health Endpoint**: `http://localhost:3000/api/health`
- **Cluster Overview API**: `http://localhost:3000/api/overview`

## Local Development & Docker

### Docker Compose Cluster

To launch the multi-node federated simulation in isolated containers:

```bash
docker compose -f docker/docker-compose.yml up --build
```

### Running Unit & Engine Tests

```bash
npm test
```

## Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health and node heartbeat status |
| `GET` | `/api/overview` | Active hospital nodes, rounds, and Mean Dice score |
| `GET` | `/api/nodes` | List connected hospital nodes and local parameters |
| `POST` | `/api/training/start` | Trigger a new federated learning round |
| `GET` | `/api/privacy/config` | Fetch Differential Privacy & HE encryption parameters |
| `GET` | `/api/audit/logs` | Immutable audit trail for HIPAA/GDPR validation |

## Project Structure

```text
FedMed/
├── hospital_nodes/       Hospital client node logic and local data loaders
├── fl_server/            Central federated aggregator and strategy algorithms
├── models/               3D U-Net volumetric segmentation neural network
├── encryption/           TenSEAL and Paillier homomorphic encryption modules
├── grpc/                 Protocol buffer definitions and gRPC service stubs
├── src/                  React 18 frontend components and 3D MRI viewer
├── docker/               Multi-node Dockerfiles and docker-compose configurations
├── Docs/                 Architecture, PRD, and regulatory compliance docs
└── README.md
```

## Connect With Us

### Sunil Sharma
- GitHub: [@sunbyte16](https://github.com/sunbyte16)
- LinkedIn: [Sunil Sharma](https://www.linkedin.com/in/sunil-kumar-bb88bb31a/)
- Portfolio: [lively-dodol-cc397c.netlify.app](https://lively-dodol-cc397c.netlify.app)

### Monish Prasanna
- GitHub: [@ymp7](https://github.com/ymp7)
- LinkedIn: [Monish Prasanna](https://www.linkedin.com/in/yegireddy-monish-prasanna/)

## Creators

<div align="center">

### Crafted By ♥  𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒 & 𝕄𝕠𝕟𝕚𝕤𝕙 ℙ𝕣𝕒𝕤𝕒𝕟𝕟𝕒

</div>

## License

Proprietary - AXLERO SOLUTIONS
