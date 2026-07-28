# FedMed – Operational & Privacy Rules

---

### 1. Mandatory Privacy Rules
1. **Zero Raw Data Egress**: Under NO circumstances shall raw DICOM/NIfTI pixel arrays, patient metadata, or patient identifiers leave the local hospital filesystem.
2. **Mandatory Encryption in Transit**: Unencrypted model parameters or gradients are strictly forbidden on any network interface.
3. **Differential Privacy Guarantee**: Every round update must pass through gradient clipping and noise injection before server transmission.
4. **Privacy Budget Enforcement**: When a hospital node exhausts its configured $(\epsilon, \delta)$ privacy budget, training on that node MUST immediately halt.

---

### 2. Code Quality & Architectural Rules
1. **Clean Architecture**: Strict separation of Controller (API/Routing), Service (Business Logic), Repository (Data Access), and Domain Models.
2. **Type Safety**: Mandatory TypeScript interfaces across frontend components and Pydantic models across Python backend services.
3. **No Mocks in Production Logic**: All cryptographic routines, metrics calculations (Dice, IoU, Loss), and state updates must run real mathematical functions.
4. **Resilient Communication**: All gRPC / HTTP calls must support exponential backoff, timeout protection, and heartbeat failure detection.
