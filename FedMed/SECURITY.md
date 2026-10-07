# 🛡️ Security Policy & Compliance Disclosure

The security and privacy of healthcare data and patient confidentiality are the foundational tenets of **FedMed AI Engine**. We take all security and privacy vulnerabilities seriously.

---

## 🔒 Supported Versions

We provide security patches and updates for the following versions:

| Version | Supported | Status |
| :--- | :---: | :--- |
| `1.0.x` | ✅ | Active Development & Maintenance |
| `< 1.0.0` | ❌ | Deprecated |

---

## 🚨 Reporting a Vulnerability

**DO NOT file a public GitHub issue for security or cryptographic vulnerabilities.**

If you believe you have discovered a security vulnerability, side-channel attack, privacy budget leakage, or cryptographic implementation flaw, please report it privately:

1. **Email or Direct Message**: Contact maintainer **𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒** via [LinkedIn](https://www.linkedin.com/in/sunil-kumar-bb88bb31a/) or private security advisory on GitHub.
2. **Provide Details**:
   - Severity and scope of the vulnerability.
   - Attack vector and affected component (`TenSEAL CKKS`, `DP-SGD Engine`, `mTLS gRPC`, `Express Auth`).
   - Detailed proof-of-concept (PoC) or reproduction steps.
   - Potential impact on Protected Health Information (PHI) or cryptographic integrity.

### Response Timeline
- **Initial Acknowledgment**: Within 24-48 hours.
- **Triage & Assessment**: Within 72 hours.
- **Patch & Release Advisory**: Priority triage with coordinated disclosure window.

---

## 🏥 HIPAA & GDPR Security Incident Protocol

In accordance with:
- **HIPAA Security Rule (45 CFR Part 160 and Part 164, Subparts A and C)**
- **GDPR Article 33 & 34 (Notification of a Personal Data Breach)**

The platform adheres to:
1. **Zero-PHI Perimeter Invariance**: Raw medical scans, patient identifiers, and DICOM headers must never cross institutional boundaries under any circumstances.
2. **Homomorphic Encryption Auditability**: All tensor weight aggregations must verify ciphertext shape, polynomial modulus degree ($N=8192$), and scaling factor before evaluation.
3. **Differential Privacy Budget Guards**: If a hospital client's cumulative $\epsilon$ spend approaches or exceeds target $\epsilon = 10.0$, the client is immediately quarantined from further training epochs to preserve differential privacy bounds.
