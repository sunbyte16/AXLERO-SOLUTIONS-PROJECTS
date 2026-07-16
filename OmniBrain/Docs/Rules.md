# OmniBrain - AI Development Rules

Version: 1.0

Status: Active

Purpose:
This document defines the coding standards, architectural constraints, development guidelines, and AI behavior rules for the OmniBrain project. Every AI-generated implementation must comply with these rules.

---

# General Rules

- Always prioritize code readability over clever implementations.
- Write production-ready code only.
- Never generate placeholder or mock implementations unless explicitly requested.
- Prefer modular and reusable components.
- Follow the Single Responsibility Principle (SRP).
- Avoid unnecessary complexity.
- Use modern best practices.
- Every function must have a clear purpose.

---

# Project Structure Rules

Never change the root project structure.

Required folders:

backend/
frontend/
agents/
rag/
vision/
database/
embeddings/
storage/
tests/
docs/
scripts/

Do not create random folders.

Group related files together.

---

# Backend Rules

Framework

- FastAPI

Language

- Python 3.12+

Rules

- Use async endpoints whenever possible.
- Use dependency injection.
- Use Pydantic models for all request/response validation.
- Keep business logic inside services.
- Keep API routes thin.
- Never place database logic inside route handlers.
- Never place AI logic inside controllers.
- Separate configuration from code.

---

# Frontend Rules

Framework

- React
- TypeScript
- Vite

Rules

- Use functional components only.
- Use hooks instead of class components.
- Keep components small and reusable.
- Avoid prop drilling.
- Use Zustand for global state.
- Use React Query for API communication.
- Use Tailwind CSS only.
- Do not use inline styles.

---

# Python Coding Standards

Follow

- PEP 8
- Type Hints
- Docstrings
- Black Formatting

Every function should:

- Accept typed parameters
- Return typed values
- Handle exceptions gracefully

Example

def search_documents(query: str) -> list[Document]:

Avoid

- Global variables
- Magic numbers
- Nested functions
- Long functions (>50 lines)

---

# TypeScript Standards

Enable

- Strict Mode

Always use

- Interfaces
- Types
- Enums when appropriate

Avoid

- any
- var

Prefer

const

instead of

let

---

# API Rules

RESTful APIs only.

Naming

GET

/api/documents

POST

/api/documents

PUT

/api/documents/{id}

DELETE

/api/documents/{id}

Rules

- Return proper HTTP status codes.
- Validate all inputs.
- Return consistent JSON.
- Never expose stack traces.
- Paginate large responses.

---

# Database Rules

Primary Database

PostgreSQL

Vector Database

Qdrant

Rules

- Use UUID primary keys.
- Never use auto-increment IDs.
- Add timestamps to every table.
- Use foreign keys.
- Normalize relational data.
- Store embeddings only in Qdrant.

---

# Authentication Rules

Authentication

JWT

Authorization

Role-Based Access Control (RBAC)

Passwords

- Hash using bcrypt
- Never store plain text passwords

Sessions

- Stateless

---

# AI Rules

The AI must never:

- Hallucinate information.
- Fabricate citations.
- Answer without retrieved context.
- Ignore confidence scores.
- Skip validation.

The AI must always:

- Retrieve first.
- Verify retrieved content.
- Cite every response.
- Explain uncertainty.
- Use the correct agent.

---

# LangGraph Rules

Supervisor Agent

Responsibilities

- Intent Detection
- Routing
- Memory
- Planning

Never allow the Supervisor to answer users directly.

Sub-agents are responsible for execution.

---

# Search Agent Rules

Always

- Search vector database first.
- Rank retrieved chunks.
- Return metadata.
- Respect similarity thresholds.

Never

- Return unrelated chunks.
- Ignore metadata filters.

---

# Vision Agent Rules

Always

- Analyze charts.
- Extract tables.
- Describe diagrams.
- Return confidence score.

Never

- Guess chart values.
- Invent labels.

---

# SQL Agent Rules

Always

- Generate parameterized SQL.
- Validate schema before execution.
- Prevent SQL injection.

Never

- Execute destructive queries.
- Allow DROP, DELETE, or ALTER statements without explicit authorization.

---

# RAG Rules

Always

- Chunk documents intelligently.
- Preserve document hierarchy.
- Maintain metadata.
- Store source references.

Chunk Size

800–1200 tokens

Chunk Overlap

150–250 tokens

---

# Embedding Rules

Preferred Models

- text-embedding-3-large
- BGE Large
- Instructor XL

Store

- Document ID
- Chunk ID
- Page Number
- Source
- Metadata

---

# Prompt Engineering Rules

Prompts must

- Be deterministic.
- Include retrieved context.
- Define system instructions.
- Request citations.
- Limit hallucination.

Never hardcode prompts inside business logic.

Store prompts separately.

---

# Error Handling Rules

Always

- Catch exceptions.
- Log errors.
- Return meaningful messages.
- Hide internal implementation.

Never expose

- API Keys
- Stack traces
- Database schema
- Internal prompts

---

# Logging Rules

Log

- Requests
- Errors
- Agent routing
- API latency
- Token usage

Never log

- Passwords
- API keys
- Sensitive documents
- Personal information

---

# Security Rules

Always

- Validate uploads.
- Scan file types.
- Limit upload size.
- Sanitize filenames.
- Escape user input.

Never

- Trust client input.
- Execute uploaded files.
- Store secrets in Git.

---

# Performance Rules

Target

API Response

< 3 seconds

Vector Search

< 1 second

Embedding Generation

< 10 seconds

Concurrent Users

100+

Use

- Async programming
- Background tasks
- Connection pooling
- Caching

---

# Testing Rules

Every feature requires

- Unit Tests
- Integration Tests
- API Tests

Target Coverage

80%+

Never merge untested code.

---

# Git Rules

Branch Strategy

main

develop

feature/<feature-name>

bugfix/<issue-name>

Commit Format

feat:

fix:

docs:

refactor:

test:

chore:

Example

feat: implement document upload API

---

# Documentation Rules

Every module must contain

- README
- Docstrings
- API documentation
- Usage examples

Public functions must be documented.

---

# Code Quality Rules

Maximum Function Length

50 lines

Maximum File Length

400 lines

Maximum Class Length

300 lines

Cyclomatic Complexity

< 10

---

# Dependency Rules

Preferred Libraries

Backend

- FastAPI
- SQLAlchemy
- Pydantic
- LangChain
- LangGraph
- Qdrant Client
- Redis
- Celery

Frontend

- React
- Tailwind CSS
- React Query
- Zustand
- React Hook Form

Avoid unnecessary dependencies.

---

# AI Response Rules

Every AI response must include

- Answer
- Supporting Evidence
- Citations
- Confidence Score
- Related Sources (if available)

Never answer without evidence.

---

# Definition of Done

A task is complete only if

- Code compiles.
- Tests pass.
- API documented.
- UI responsive.
- No lint errors.
- No type errors.
- Documentation updated.
- Security reviewed.
- Performance acceptable.
- Code committed.

---

# Golden Principles

1. Retrieval before generation.
2. Security before convenience.
3. Simplicity over complexity.
4. Modular over monolithic.
5. Evidence over assumptions.
6. Async over blocking.
7. Quality over speed.
8. Reusability over duplication.
9. Production-ready over prototype.
10. Every response must be explainable and traceable.
