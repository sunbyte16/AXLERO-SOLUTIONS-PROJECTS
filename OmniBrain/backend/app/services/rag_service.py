"""RAG pipeline service."""

from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.models.user import User
from app.schemas import CitationSchema

logger = get_logger(__name__)


@dataclass
class RAGResult:
    answer: str
    citations: list[CitationSchema]
    confidence: float
    agent_used: str


class RAGService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def generate_response(self, user: User, query: str) -> RAGResult:
        """Generate a grounded response using the agent pipeline."""
        if not settings.OPENAI_API_KEY:
            return RAGResult(
                answer=(
                    "OmniBrain is running, but no OpenAI API key is configured. "
                    "Add OPENAI_API_KEY to your .env file, upload documents, "
                    "and the RAG pipeline will retrieve and cite relevant content."
                ),
                citations=[],
                confidence=0.0,
                agent_used="system",
            )

        try:
            from rag.pipeline import run_rag_pipeline

            result = await run_rag_pipeline(user_id=str(user.id), query=query)
            return RAGResult(
                answer=result["answer"],
                citations=[CitationSchema(**c) for c in result.get("citations", [])],
                confidence=result.get("confidence", 0.0),
                agent_used=result.get("agent_used", "supervisor"),
            )
        except Exception as exc:
            logger.error("rag_pipeline_failed", error=str(exc))
            return RAGResult(
                answer="I encountered an error processing your request. Please try again.",
                citations=[],
                confidence=0.0,
                agent_used="error",
            )

    async def process_document(self, document_id: str, file_path: str, file_type: str) -> int:
        """Process and index a document into the vector store."""
        from ingestion.processor import process_document

        return await process_document(document_id=document_id, file_path=file_path, file_type=file_type)
