# OmniBrain - System Architecture

Version: 1.0

Status: Planning

---

# Overview

OmniBrain is an enterprise-grade Agentic Multi-Modal Retrieval-Augmented Generation (RAG) platform that enables users to interact with documents, databases, images, and charts using AI.

The system combines multiple specialized AI agents coordinated through LangGraph to retrieve, reason, and generate grounded responses with citations.

---

# High-Level Architecture

                    +----------------------+
                    |      React UI        |
                    +----------+-----------+
                               |
                               |
                    HTTPS / REST API
                               |
                               |
                    +----------v-----------+
                    |      FastAPI API     |
                    +----------+-----------+
                               |
             +-----------------+------------------+
             |                 |                  |
             |                 |                  |
     Authentication      Document Service     Chat Service
             |                 |                  |
             +-----------------+------------------+
                               |
                               |
                    +----------v-----------+
                    |  LangGraph Supervisor|
                    +----------+-----------+
                               |
      ---------------------------------------------------------
      |                 |               |                     |
      |                 |               |                     |
 Search Agent      Vision Agent     SQL Agent        Citation Agent
      |                 |               |                     |
      ---------------------------------------------------------
                               |
                    +----------v-----------+
                    |      LLM Engine      |
                    +----------+-----------+
                               |
             -----------------------------------------
             |                  |                    |
             |                  |                    |
       Qdrant Vector DB   PostgreSQL DB      Object Storage

---

# System Components

## Frontend

Framework

- React
- TypeScript
- Vite

Responsibilities

- Authentication
- Dashboard
- Chat Interface
- Upload Documents
- Document Viewer
- Citation Viewer
- Settings

---

## Backend

Framework

- FastAPI

Responsibilities

- API Gateway
- Authentication
- Agent Execution
- File Processing
- Chat Management
- Database Access

---

## AI Layer

Framework

- LangGraph

Purpose

Coordinates multiple AI agents.

Agents

- Supervisor Agent
- Search Agent
- Vision Agent
- SQL Agent
- Citation Agent
- Summary Agent

---

## Retrieval Layer

Responsibilities

- Chunk Documents
- Generate Embeddings
- Similarity Search
- Metadata Filtering

Technologies

- LangChain
- Qdrant
- FAISS (optional)

---

## Vision Layer

Responsibilities

- Chart Understanding
- Image Captioning
- OCR
- Table Understanding

Models

- GPT-4o Vision
- LLaVA

---

## Database Layer

Primary Database

PostgreSQL

Stores

- Users
- Chats
- Documents
- Metadata
- Logs

Vector Database

Qdrant

Stores

- Text Embeddings
- Image Embeddings
- Metadata

Object Storage

Stores

- PDFs
- Images
- Documents

Recommended

- AWS S3
- MinIO

---

# Request Flow

Step 1

User uploads PDF.

↓

Step 2

Backend validates file.

↓

Step 3

Document Processor extracts

- Text
- Images
- Tables

↓

Step 4

Embedding Service creates embeddings.

↓

Step 5

Embeddings stored inside Qdrant.

↓

Step 6

User asks question.

↓

Step 7

Supervisor Agent analyzes intent.

↓

Step 8

Supervisor selects required agents.

↓

Step 9

Agents retrieve information.

↓

Step 10

LLM generates answer.

↓

Step 11

Citation Agent verifies sources.

↓

Step 12

Frontend displays response.

---

# Agent Workflow

Supervisor Agent

Responsibilities

- Understand query
- Decide execution path
- Manage memory
- Coordinate agents

↓

Search Agent

Responsibilities

- Semantic Retrieval
- Metadata Search
- Context Building

↓

Vision Agent

Responsibilities

- Analyze Images
- Read Charts
- Interpret Tables

↓

SQL Agent

Responsibilities

- Generate SQL
- Execute Queries
- Return Results

↓

Citation Agent

Responsibilities

- Verify Sources
- Attach References
- Confidence Score

↓

Summary Agent

Responsibilities

- Final Response
- Formatting
- Context Compression

---

# Folder Structure

omnibrain/

├── backend/
│
├── frontend/
│
├── agents/
│
├── ingestion/
│
├── rag/
│
├── embeddings/
│
├── vision/
│
├── database/
│
├── storage/
│
├── docs/
│
├── tests/
│
├── docker/
│
└── scripts/

---

# Backend Structure

backend/

app/

api/

core/

config/

middleware/

models/

schemas/

services/

repositories/

utils/

dependencies/

main.py

---

# Frontend Structure

frontend/

src/

components/

pages/

layouts/

hooks/

services/

context/

store/

assets/

styles/

utils/

App.tsx

---

# Database Tables

Users

Documents

Chats

Messages

Embeddings Metadata

Agents

Logs

Sessions

API Keys

Settings

---

# API Modules

Authentication API

Document API

Chat API

Agent API

Search API

Citation API

Analytics API

Admin API

---

# Security Architecture

Authentication

- JWT

Authorization

- Role-Based Access Control

Encryption

- HTTPS
- TLS

Secrets

- Environment Variables

API Keys

- Never exposed to frontend

Input Validation

- Pydantic

Rate Limiting

- Enabled

---

# Deployment Architecture

Frontend

React

↓

Nginx

↓

FastAPI

↓

LangGraph

↓

OpenAI

↓

Qdrant

↓

PostgreSQL

↓

Redis

↓

Object Storage

---

# Technology Stack

Frontend

- React
- TypeScript
- Tailwind CSS
- React Query
- Zustand

Backend

- FastAPI
- Python

AI

- LangChain
- LangGraph
- OpenAI
- LlamaIndex

Vector Database

- Qdrant

Database

- PostgreSQL

Storage

- MinIO
- AWS S3

Caching

- Redis

Monitoring

- Langfuse
- Prometheus
- Grafana

Containerization

- Docker
- Docker Compose

Deployment

- Nginx
- GitHub Actions

---

# Scalability

Support

- Async APIs
- Background Workers
- Horizontal Scaling
- Distributed Agents
- Load Balancing

---

# Design Principles

- Clean Architecture
- SOLID Principles
- Modular Development
- Dependency Injection
- Repository Pattern
- Async Programming
- Event-Driven Processing
- Loose Coupling
- High Cohesion

---

# Future Architecture

Future integrations may include

- Local LLMs
- Multi-Cloud Deployment
- Kubernetes
- Multi-Tenant Support
- Knowledge Graph
- Voice Agents
- MCP Servers
- AI Workflow Automation
