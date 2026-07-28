# FedMed – Project Development Phases

---

### Phase 1: Core Foundation, Architecture Docs, Simulation Engine & Medical Dashboard (CURRENT PHASE)
- Setup documentation (`PRD.md`, `Architecture.md`, `Rules.md`, `Phases.md`, `Design.md`).
- Implement core backend API server (`server.ts` / FastAPI structure).
- Implement Federated Learning orchestration simulation engine (Flower FedAvg strategy, TenSEAL HE wrapper, DP-SGD noise accountant).
- Implement Hospital Node Management protocol (Heartbeats, mTLS cert status, GPU telemetry).
- Build Enterprise React Dashboard with Recharts metrics, 3D MRI DICOM slice canvas segmentation viewer, Privacy Panel, and HIPAA Audit Logger.

---

### Phase 2: Flower Server & Multi-Node gRPC Communication
- Deploy standalone Python Flower Server with gRPC mTLS transport layer.
- Build multi-process hospital node agent worker instances.
- Implement weight serialization with Protocol Buffers (`fedmed.proto`).

---

### Phase 3: MONAI 3D U-Net Deep Learning & DICOM Preprocessing Pipeline
- PyTorch / MONAI 3D U-Net model training loop implementation on BraTS (Brain Tumor Segmentation) dataset.
- Real DICOM/NIfTI tensor loading, intensity normalization, and affine transformation pipeline.

---

### Phase 4: Production TenSEAL HE & Secure Aggregation Protocol
- Full C++ / Python TenSEAL integration for CKKS ciphertext vector operations.
- Shamir Secret Sharing based Secure Aggregation protocol for multi-party threshold decryption.

---

### Phase 5: Production Storage, PostgreSQL, Redis & MLflow Tracking
- Database migration with Alembic / SQLAlchemy.
- Redis pub/sub queue for real-time WebSockets event broadcasting.
- MLflow model registry and metric tracking integration.

---

### Phase 6: Enterprise Security Audit, HIPAA/GDPR Certification & Benchmarking
- Automated security vulnerability scanning, mTLS certificate rotation, and differential privacy mathematical verification.
- Performance benchmarking for 100+ simulated hospital nodes.
