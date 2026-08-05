"""LangGraph supervisor agent orchestrating sub-agents."""

from app.core.config import settings
from app.core.logging import get_logger
from rag.pipeline import search_context

logger = get_logger(__name__)

SYSTEM_PROMPT = """You are OmniBrain, an enterprise AI assistant.
Answer ONLY using the provided context. Every factual claim must be grounded in the context.
Include source citations in the format [Source: Document <id>, Page: <page>] for statements drawn directly from the text.
If the context is insufficient or ungrounded, say so clearly.
Never invent facts, statistics, or fake citations."""


class SupervisorAgent:
    async def run(self, user_id: str, query: str) -> dict:
        logger.info("supervisor_routing", user_id=user_id, query=query[:100])

        contexts = await search_context(query)
        if not contexts:
            return {
                "answer": (
                    "I couldn't find relevant information in your uploaded documents. "
                    "Please upload documents related to your question and try again."
                ),
                "citations": [],
                "confidence": 0.0,
                "agent_used": "search_agent",
            }

        context_text = "\n\n---\n\n".join(
            f"[Source: Document {c['document_id'][:8]}, Page: {c.get('page_number', 'N/A')}] (Relevance Score: {c['score']:.2f})\n{c['text']}"
            for c in contexts
        )

        from openai import AsyncOpenAI

        if settings.active_llm_provider == "gemini":
            client = AsyncOpenAI(
                api_key=settings.GEMINI_API_KEY,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            )
            model_name = "gemini-1.5-flash"
        else:
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            model_name = "gpt-4o-mini"

        response = await client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Retrieved Context:\n{context_text}\n\nUser Question: {query}",
                },
            ],
            temperature=0.1,
        )

        answer = response.choices[0].message.content or ""
        avg_score = sum(c["score"] for c in contexts) / len(contexts)

        citations = [
            {
                "document_id": c["document_id"],
                "document_name": f"Document {c['document_id'][:8]}",
                "page_number": c.get("page_number"),
                "excerpt": c["text"][:200] + "..." if len(c["text"]) > 200 else c["text"],
                "confidence": round(c["score"], 2),
            }
            for c in contexts[:5]
        ]

        return {
            "answer": answer,
            "citations": citations,
            "confidence": round(min(avg_score, 1.0), 2),
            "agent_used": "supervisor",
        }

