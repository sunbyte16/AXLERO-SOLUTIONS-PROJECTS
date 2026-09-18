# FedMed – System Architecture & Technical Specifications

---

### 1. High-Level System Architecture

```
                                  +---------------------------------------+
                                  |         FedMed Control Console        |
                                  |    (React + Vite + Recharts UI)       |
                                  +-------------------+-------------------+
                                                      |
                                          REST / WebSockets API
                                                      v
                                  +---------------------------------------+
                                  |         FastAPI Central Server        |
                                  |  - Orchestration & Round Scheduler    |
                                  |  - Privacy Budget Manager             |
                                  |  - Audit Logger & Telemetry Engine    |
                                  +-------------------+-------------------+
                                                      |
                                           gRPC / mTLS Protocol
                                                      |
                        +-----------------------------+-----------------------------+
                        |                                                           |
                        v                                                           v
      +-----------------------------------+                       +-----------------------------------+
      |       Hospital Node A (Silo)      |                       |       Hospital Node B (Silo)      |
      | - MONAI / PyTorch 3D U-Net        |                       | - MONAI / PyTorch 3D U-Net        |
      | - Local Brain MRI Scans (DICOM)   |                       | - Local Brain MRI Scans (DICOM)   |
      | - TenSEAL CKKS Homomorphic Enc.   |                       | - TenSEAL CKKS Homomorphic Enc.   |
      | - DP-SGD Noise Accountant         |                       | - DP-SGD Noise Accountant         |
      +-----------------------------------+                       +-----------------------------------+
```

---

### 2. Federated Learning Protocol Flow
1. **Model Initialization**: Central Server initializes global 3D U-Net weights $W_0$.
2. **Client Selection**: Flower FL Server selects a subset $S_k$ of active hospital nodes based on availability and GPU capacity.
3. **Distribution**: $W_t$ is broadcast to selected nodes via gRPC over TLS.
4. **Local Training**: Each hospital node trains $W_t$ locally on local DICOM datasets using PyTorch/MONAI for $E$ local epochs, producing local weights $W_t^{(i)}$.
5. **Local Privacy Transformation**:
   - Clip weight update gradients: $\| \Delta W_t^{(i)} \|_2 \le C$
   - Add DP Gaussian Noise: $\Delta \tilde{W}_t^{(i)} = \Delta W_t^{(i)} + \mathcal{N}(0, \sigma^2 C^2 \mathbf{I})$
   - Encrypt update via TenSEAL CKKS Homomorphic Encryption: $\text{Enc}(\Delta \tilde{W}_t^{(i)})$
6. **Encrypted Aggregation**: FL Server aggregates encrypted updates homomorphically without decrypting individual client contributions:
   $$ \text{Enc}(\Delta W_{t+1}) = \sum_{i \in S_k} \frac{n_i}{N} \text{Enc}(\Delta \tilde{W}_t^{(i)}) $$
7. **Global Model Update**: Aggregate decrypted update is applied to global model $W_{t+1} = W_t + \Delta W_{t+1}$.
8. **Convergence Check**: Compute global Dice Score, Loss, and IoU on validation dataset; log metrics to database.

---

### 3. Security & Cryptography Stack
- **Homomorphic Encryption**: TenSEAL wrapper using CKKS vector scheme (`poly_modulus_degree=8192`, `coeff_mod_bit_sizes=[60, 40, 40, 60]`).
- **Differential Privacy**: DP-SGD with noise multiplier $\sigma \in [0.5, 2.0]$, clipping threshold $C = 1.0$, privacy budget limit $\epsilon \le 10.0, \delta = 10^{-5}$.
- **Node Identity & Auth**: X.509 Certificates, mTLS authentication, JWT Tokens for Admin API access.

---

### 4. Differential Privacy & Homomorphic Encryption Formal Guarantees

#### 4.1 Renyi Differential Privacy (RDP) & Privacy Budget Accounting
FedMed implements DP-SGD based on the Gaussian mechanism. For gradient query function $f$ with sensitivity $\Delta_2(f) = \frac{2C}{|B|}$, the calibrated noise variance is:
$$\sigma = \frac{\sqrt{2 \ln(1.25/\delta)} \cdot C}{\varepsilon}$$

Over $T$ multi-institution communication rounds with subsampling ratio $q = \frac{|B|}{N}$, cumulative privacy loss $(\varepsilon, \delta)$ is tracked via analytical moments accountant:
$$\varepsilon(\delta) = \min_{\alpha > 1} \left( T \cdot \frac{\alpha q^2}{2 \sigma^2} + \frac{\ln(1/\delta)}{\alpha - 1} \right)$$

#### 4.2 CKKS Homomorphic Encryption Parameter Selection
- **Polynomial Modulus Degree ($N$)**: $8192$ (provides $>128$-bit quantum security under RLWE hard problem assumptions).
- **Coefficient Modulus Chain**: $\{60, 40, 40, 60\}$ bits with initial scaling factor $\Delta = 2^{40}$.
- **Galois & Relin Keys**: Rotational slot evaluation keys generated locally at each hospital silo, preventing central server or adversarial proxy eavesdropping.
