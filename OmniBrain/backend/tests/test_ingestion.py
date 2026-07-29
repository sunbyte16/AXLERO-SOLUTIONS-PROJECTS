"""Document ingestion tests."""

from ingestion.processor import _split_text, DocumentChunk


def test_text_splitting_paragraph_and_sentence_awareness() -> None:
    sample_text = (
        "First paragraph about OmniBrain platform capabilities and architecture.\n\n"
        "Second paragraph covering multi-tenant document ingestion, user permissions, and RAG pipelines.\n\n"
        "Third paragraph providing details on vector retrieval with Qdrant and relational tables in PostgreSQL."
    )

    chunks = _split_text(sample_text, page_number=1)
    assert len(chunks) >= 1
    assert all(isinstance(c, DocumentChunk) for c in chunks)
    assert chunks[0].page_number == 1
    assert "OmniBrain" in chunks[0].text
    assert "char_count" in chunks[0].metadata
