"""RAG retrieval and generation pipeline."""

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


async def run_rag_pipeline(user_id: str, query: str) -> dict:
    """Execute the full RAG pipeline with agent orchestration."""
    from agents.supervisor import SupervisorAgent

    supervisor = SupervisorAgent()
    return await supervisor.run(user_id=user_id, query=query)


async def search_context(query: str, limit: int = 5) -> list[dict]:
    """Retrieve relevant chunks from Qdrant."""
    from openai import AsyncOpenAI
    from qdrant_client.models import Filter, FieldCondition, MatchValue

    from app.core.clients import get_qdrant

    if settings.active_llm_provider == "gemini":
        client = AsyncOpenAI(
            api_key=settings.GEMINI_API_KEY,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        )
        model_name = "text-embedding-004"
    else:
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        model_name = "text-embedding-3-small"

    embedding_resp = await client.embeddings.create(
        model=model_name,
        input=query,
    )
    vector = embedding_resp.data[0].embedding

    qdrant = get_qdrant()
    results = await qdrant.search(
        collection_name=settings.QDRANT_COLLECTION,
        query_vector=vector,
        limit=limit,
        score_threshold=0.3,
    )

    return [
        {
            "text": hit.payload.get("text", ""),
            "document_id": hit.payload.get("document_id", ""),
            "page_number": hit.payload.get("page_number"),
            "score": hit.score,
        }
        for hit in results
    ]
