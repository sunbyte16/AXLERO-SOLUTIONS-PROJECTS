# Axlero Solutions — Enterprise AI & Distributed Systems Suite

<p align="left">
  <img src="https://img.shields.io/badge/Status-Production%20Verified-brightgreen?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Architecture-Multi--Agent%20%7C%20Federated%20%7C%20DRL-blueviolet?style=flat-square" alt="Architecture">
  <img src="https://img.shields.io/badge/Compliance-HIPAA%20%7C%20GDPR%20Compliant-00C853?style=flat-square" alt="Compliance">
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/React-18%20%2F%2019-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Three.js-3D%20WebGL-black?style=flat-square&logo=threedotjs&logoColor=white" alt="Three.js">
</p>

This repository houses the core enterprise AI and distributed systems platforms engineered by **Axlero Solutions**. It consolidates three advanced architectures spanning Multi-Agent RAG Orchestration, Privacy-Preserving Healthcare Federated Learning, and Multi-Agent Deep Reinforcement Learning for continuous 3D drone swarm simulations.

---

## ?? Portfolio Overview & Directory Map

`
AXLERO-SOLUTIONS-PROJECTS/
+-- OmniBrain/                 # Project 1: Agentic Multi-Modal RAG Orchestrator
+-- FedMed/                    # Project 2: Privacy-Preserving Medical Federated Learning
+-- SwarmRL/                   # Project 3: MAPPO Autonomous 3D Drone Swarm Simulator
+-- AXLERO_PROJECTS_REPORT.md  # Comprehensive Multi-Project Executive Status Report
+-- PROJECT PROGRESS REPORT.pdf # Formal PDF Progress Deliverable
+-- README.md                  # Unified Suite Documentation
`

---

## ?? The Three Flagship Platforms

### 1. OmniBrain — Agentic Multi-Modal RAG Orchestrator
* **Domain:** Complex Financial & Enterprise Document Intelligence
* **Stack:** Python 3.10+, LangGraph, FAISS, SQLite, GPT-4o Vision, FastAPI, React 18, Vite
* **Description:** An autonomous multi-agent system designed to answer intricate queries over multi-page financial documents that interweave unstructured text, tabular data, and visual charts. A LangGraph Supervisor dynamically routes sub-tasks across specialized Search, SQL, and Vision agents, strictly enforcing [Source: document.pdf, Page: N] citations and recursion loop guards.

`
                      User Query
                          ¦
                          ?
              +-------------------------+
              ¦    Supervisor Agent     ¦  LangGraph State Machine
              ¦    (supervisor.py)      ¦  Dynamic Routing & Loop Guard
              +-------------------------+
                          ¦
         +----------------+----------------+
         ?                ?                ?
  +-------------+  +-------------+  +-------------+
  ¦Search Agent ¦  ¦  SQL Agent  ¦  ¦Vision Agent ¦
  +-------------+  +-------------+  +-------------+
         ¦                ¦                ¦
         ?                ?                ?
    FAISS Index      SQLite DB        GPT-4o Vision
   (Text Chunks)  (Structured Data)  (Page Renderings)
`

---

### 2. FedMed — Privacy-Preserving Healthcare Federated Learning
* **Domain:** Collaborative Multi-Hospital Brain Tumor Segmentation (3D MRI/CT)
* **Stack:** React 19, TypeScript, Express, Vite, TailwindCSS, TenSEAL (CKKS), DP-SGD, SQL.js
* **Description:** Enables healthcare networks to collaboratively train 3D U-Net segmentation models across institutions without sharing sensitive patient Protected Health Information (PHI). Model weights are encrypted using CKKS Homomorphic Encryption, protected via Differential Privacy (DP-SGD with moments accountant), and transported over mutual TLS (mTLS).
* **Key Benchmarks:** Mean Dice Score **0.901**, Mean IoU **0.819**, Privacy Budget **$\varepsilon = 3.36 / 10.0$**.

`
 +--------------------------------------------------------+
 ¦            FedMed Central Aggregator / Server          ¦
 ¦   - Secure Federated Averaging (FedAvg)                ¦
 ¦   - Homomorphic Encrypted Aggregation (TenSEAL CKKS)   ¦
 ¦   - Global Privacy Budget Tracking (Moments Accountant)¦
 +--------------?--------------------------?--------------+
                ¦                          ¦
   mTLS Encrypted Gradients     mTLS Encrypted Gradients
   (Homomorphically Encrypted)   (Homomorphically Encrypted)
                ¦                          ¦
 +-------------------------+    +-------------------------+
 ¦ Hospital Node A (Boston)¦    ¦Hospital Node B (Munich) ¦
 ¦ - Local 3D U-Net        ¦    ¦- Local 3D U-Net         ¦
 ¦ - DP-SGD Noise Addition ¦    ¦- DP-SGD Noise Addition  ¦
 ¦ - Zero PHI Egress       ¦    ¦- Zero PHI Egress        ¦
 +-------------------------+    +-------------------------+
`

---

### 3. SwarmRL — Multi-Agent DRL 3D Disaster Simulator
* **Domain:** Autonomous Drone Swarm Search-and-Rescue Coordination
* **Stack:** React 19, Three.js, React Three Fiber, Express, WebSockets, MAPPO, SQLite
* **Description:** An authoritative 20Hz (50ms) physics simulator training up to 50 autonomous drone agents using Multi-Agent Proximal Policy Optimization (MAPPO) with Centralized Training and Decentralized Execution (CTDE). Real-time telemetry, swarm heatmaps, and dynamic wind disturbances are visualized in high-fidelity 3D WebGL.

---

## ??? Quickstart Guide

### Running OmniBrain
`ash
cd OmniBrain
pip install -r requirements.txt
python backend/init_db.py
uvicorn backend.api:app --host 0.0.0.0 --port 8000
# In a separate terminal for frontend:
cd frontend && npm install && npm run dev
`

### Running FedMed
`ash
cd FedMed
npm install
npm run dev
# Open http://localhost:3000
`

### Running SwarmRL
`ash
cd SwarmRL
npm install --ignore-scripts
npm run dev
# Open http://localhost:3000
`

---

## ?? Comprehensive Status Report
For the complete technical breakdown, verification audit, and deployment readiness benchmarks, refer to:
?? **[AXLERO_PROJECTS_REPORT.md](./AXLERO_PROJECTS_REPORT.md)**

---

## ?? Security & Privacy Compliance
* **HIPAA / GDPR Ready:** Zero PHI egress in federated medical pipelines.
* **Grounding Guardrails:** Citation-backed RAG prevents generative hallucinations.
* **Encrypted Aggregation:** End-to-end homomorphic weight aggregation.

---
*© 2026 Axlero Solutions. All rights reserved.*

