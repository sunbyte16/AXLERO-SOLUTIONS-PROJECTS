# OmniBrain Project Memory & Architecture Blueprint

**Repository Path**: `C:\Axlero Solutions\AXLERO-SOLUTIONS-PROJECTS\OmniBrain`  
**Project Type**: Enterprise Agentic Multi-Modal RAG Platform  
**Last Updated**: July 29, 2026  

---

## 1. Project Overview

**OmniBrain** is an enterprise-grade multi-tenant Retrieval-Augmented Generation (RAG) platform. It provides document intelligence, workspace isolation, user authentication, grounded AI chat with citation enforcement, and resilient multi-database fallback capabilities.

---

## 2. Comprehensive System Architecture

```
OmniBrain (Enterprise Platform)/
├── Docs/                              # Comprehensive Product & System Documentation
│   ├── Architecture.md                # System topology & database ER diagrams
│   ├── Design.md                      # UI/UX design specifications & palette
│   ├── PRD.md                         # Product Requirements Document
│   ├── Phases.md                      # Feature implementation roadmap
│   └── Rules.md                       # Development guidelines & conventions
├── backend/                           # Layered FastAPI Application
│   ├── app/
│   │   ├── api/                       # API Route Controllers
│   │   │   ├── auth.py                # Registration, Login, JWT auth, Rate limiting
│   │   │   ├── chat.py                # Multi-session chat & message history
│   │   │   ├── documents.py           # Document upload, listing, deletion
│   │   │   ├── health.py              # System health check endpoint (/api/health)
│   │   │   └── router.py              # Main API router aggregator
│   │   ├── core/                      # Application Infrastructure
│   │   │   ├── clients.py             # Lazy loaders for Redis & Qdrant clients
│   │   │   ├── config.py              # Pydantic Settings & environment variables
│   │   │   ├── database.py            # Async engine setup & auto SQLite fallback
│   │   │   ├── logging.py             # Structlog & standard logging adapter
│   │   │   └── security.py           # Password hashing & JWT token handling
│   │   ├── dependencies/              # FastAPI Request Dependencies
│   │   │   └── auth.py                # Current user extraction & token verification
│   │   ├── models/                    # SQLAlchemy Async ORM Models
│   │   │   ├── base.py                # Declarative base & timestamp mixins
│   │   │   ├── user.py                # User account & role definitions
│   │   │   ├── document.py            # Document metadata & status tracking
│   │   │   └── chat.py                # ChatSession & Message models
│   │   ├── schemas/                   # Pydantic Validation Contracts
│   │   │   └── __init__.py            # User, Document, Chat, Citation, Health schemas
│   │   ├── services/                  # Business Logic Layer
│   │   │   ├── auth_service.py        # Authentication & registration logic
│   │   │   ├── chat_service.py        # Chat management & RAG invocation
│   │   │   ├── document_service.py    # File storage & metadata creation
│   │   │   ├── indexing_service.py    # Background task document processing
│   │   │   └── rag_service.py         # RAG pipeline bridge
│   │   └── main.py                    # FastAPI Entrypoint & CORS configuration
│   ├── tests/                         # Pytest Automated Test Suite
│   │   ├── test_auth.py               # Registration & JWT auth test suite
│   │   ├── test_health.py             # Health check endpoint test suite
│   │   └── test_ingestion.py          # Document text chunking test suite
│   ├── omnibrain.db                   # Embedded SQLite database (development fallback)
│   ├── pyproject.toml                 # Backend project configuration & test settings
│   └── requirements.txt               # Backend Python dependencies
├── frontend/                          # React 18 + TypeScript + Vite Application
│   ├── src/
│   │   ├── pages/                     # Full Application Views
│   │   │   ├── AnalyticsPage.tsx      # System analytics & usage charts
│   │   │   ├── ChatPage.tsx           # Multi-session grounded AI chat interface
│   │   │   ├── DashboardPage.tsx      # Platform overview & recent activity
│   │   │   ├── DocumentsPage.tsx      # File uploader dropzone & status ledger
│   │   │   ├── LoginPage.tsx          # Account login screen
│   │   │   ├── RegisterPage.tsx       # Account creation screen
│   │   │   └── SettingsPage.tsx       # Profile & system settings
│   │   ├── store/                     # Zustand State Management
│   │   ├── services/                  # Axios HTTP Clients & API hooks
│   │   ├── index.css                  # Global Tailwind CSS styles
│   │   └── App.tsx                    # React Router configuration & route guards
│   ├── package.json
│   └── vite.config.ts
├── agents/                            # Multi-Agent Intelligence Layer
│   └── supervisor.py                  # Supervisor Agent with citation grounding
├── ingestion/                         # Document Ingestion Engine
│   └── processor.py                   # Paragraph/sentence-aware text chunker
├── rag/                               # Vector Retrieval & Context Assembly
│   └── pipeline.py                    # Qdrant dense vector search execution
├── embeddings/                        # Embedding Generation Service
│   └── service.py                     # OpenAI text-embedding-3-small integration
├── docker-compose.yml                 # Multi-container cluster configuration
└── memory.md                          # Project Memory & Master Blueprint (This File)
```

---

## 3. Core Features & Built Modules

### A. Authentication & Security
* **JWT Access & Refresh Tokens**: Standard OAuth2 Bearer token authentication with configurable expiration (`JWT_ACCESS_TOKEN_EXPIRE_MINUTES`).
* **Bcrypt Password Security**: Enforces password complexity rules (uppercase, lowercase, digits, special characters).
* **Sliding Window Rate Limiting**: Per-IP/email rate limiting via Redis with local sliding window dictionary fallback (`_RATE_LIMIT_WINDOW`).

### B. Document Ingestion & Smart Chunking
* **Multi-Format Ingestion**: Supports `PDF` (via `pypdf`), `DOCX` (via `python-docx`), `CSV`, `XLSX`, `TXT`, and images.
* **Paragraph & Sentence-Aware Chunking**: [`ingestion/processor.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/ingestion/processor.py) splits documents along natural paragraph (`\n\n`) and sentence boundaries with 150-character overlap, attaching metadata (`char_count`, `page_number`).

### C. Grounded RAG & Citation Enforcement
* **Vector Retrieval**: Dense vector search via Qdrant (`text-embedding-3-small` embeddings).
* **Supervisor Agent**: [`agents/supervisor.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/agents/supervisor.py) formats context and enforces strict citation grounding (`[Source: Document <id>, Page: <page>]`).
* **Citation Pills**: Frontend renders citation pills linked to original document source excerpts.

### D. Zero-Configuration Local Resiliency
* **Automatic SQLite Fallback**: [`database.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/backend/app/core/database.py) automatically creates a local SQLite database (`omnibrain.db`) if PostgreSQL is unreachable or drivers are missing.
* **Lazy Client Loaders**: Redis and Qdrant clients ([`clients.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/backend/app/core/clients.py)) load lazily, preventing startup crashes when external servers are offline.
* **Logging Fallback**: [`logging.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/backend/app/core/logging.py) uses `structlog` when available, with automatic fallback to standard library `logging`.
* **Email Validation Fallback**: [`schemas/__init__.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/backend/app/schemas/__init__.py) falls back to regex validation if `email-validator` package is absent.

---

## 4. Verification & QA Status

* **Automated Tests**: Executed via `python -m pytest backend/tests/`
  * [`test_auth.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/backend/tests/test_auth.py): User registration & login (uses `pytest.importorskip("aiosqlite")`).
  * [`test_health.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/backend/tests/test_health.py): Health check route verification (uses `@pytest.mark.anyio`).
  * [`test_ingestion.py`](file:///C:/Axlero%20Solutions/AXLERO-SOLUTIONS-PROJECTS/OmniBrain/backend/tests/test_ingestion.py): Text chunking and paragraph splitting.
* **Clean Code Status**: All legacy telemetry hooks (`_report_debug_event`) stripped.

---

## 5. Development & Deployment Commands

### Running Full Stack with Docker
```bash
docker compose up --build
```

### Running Backend Locally
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Running Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

### Running Automated Test Suite
```bash
python -m pytest backend/tests/
```
