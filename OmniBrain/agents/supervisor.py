"""LangGraph supervisor agent orchestrating sub-agents."""

from app.core.config import settings
from app.core.logging import get_logger
from rag.pipeline import search_context

logger = get_logger(__name__)

SYSTEM_PROMPT = """You are OmniBrain, an enterprise AI assistant.
Answer ONLY using the provided context. If the context is insufficient, say so clearly.
Always be precise, professional, and cite sources when possible.
Never invent facts or citations."""


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
            f"[Source {i+1}] (Page {c.get('page_number', 'N/A')}, Score: {c['score']:.2f})\n{c['text']}"
            for i, c in enumerate(contexts)
        )

        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Context:\n{context_text}\n\nQuestion: {query}",
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
            for c in contexts[:3]
        ]

        return {
            "answer": answer,
            "citations": citations,
            "confidence": round(avg_score, 2),
            "agent_used": "supervisor",
        }
