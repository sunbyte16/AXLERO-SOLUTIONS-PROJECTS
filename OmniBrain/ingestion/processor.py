"""Document ingestion and content extraction."""

from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader


@dataclass
class DocumentChunk:
    text: str
    page_number: int | None
    chunk_index: int
    metadata: dict[str, str]


CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150


def _split_text(text: str, page_number: int | None = None) -> list[DocumentChunk]:
    """Split text into sentence and paragraph-aware chunks with overlap."""
    clean_text = text.strip()
    if not clean_text:
        return []

    # Split into logical paragraphs first
    paragraphs = [p.strip() for p in clean_text.split("\n\n") if p.strip()]
    if not paragraphs:
        paragraphs = [clean_text]

    chunks: list[DocumentChunk] = []
    current_chunk: list[str] = []
    current_length = 0
    chunk_index = 0

    for paragraph in paragraphs:
        para_len = len(paragraph)
        if current_length + para_len + 2 <= CHUNK_SIZE:
            current_chunk.append(paragraph)
            current_length += para_len + 2
        else:
            if current_chunk:
                combined_text = "\n\n".join(current_chunk)
                chunks.append(
                    DocumentChunk(
                        text=combined_text,
                        page_number=page_number,
                        chunk_index=chunk_index,
                        metadata={
                            "page": str(page_number) if page_number else "unknown",
                            "char_count": str(len(combined_text)),
                        },
                    )
                )
                chunk_index += 1

            # Handle paragraph longer than chunk size by sentence splitting
            if para_len > CHUNK_SIZE:
                words = paragraph.split()
                sub_start = 0
                while sub_start < len(words):
                    sub_end = min(sub_start + 150, len(words))
                    sub_text = " ".join(words[sub_start:sub_end])
                    chunks.append(
                        DocumentChunk(
                            text=sub_text,
                            page_number=page_number,
                            chunk_index=chunk_index,
                            metadata={
                                "page": str(page_number) if page_number else "unknown",
                                "char_count": str(len(sub_text)),
                            },
                        )
                    )
                    chunk_index += 1
                    if sub_end >= len(words):
                        break
                    sub_start = sub_end - 25
                current_chunk = []
                current_length = 0
            else:
                current_chunk = [paragraph]
                current_length = para_len

    if current_chunk:
        combined_text = "\n\n".join(current_chunk)
        chunks.append(
            DocumentChunk(
                text=combined_text,
                page_number=page_number,
                chunk_index=chunk_index,
                metadata={
                    "page": str(page_number) if page_number else "unknown",
                    "char_count": str(len(combined_text)),
                },
            )
        )

    return chunks


def extract_pdf(file_path: str) -> list[DocumentChunk]:
    reader = PdfReader(file_path)
    all_chunks: list[DocumentChunk] = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        all_chunks.extend(_split_text(text, page_number=i + 1))
    return all_chunks


def extract_text_file(file_path: str) -> list[DocumentChunk]:
    text = Path(file_path).read_text(encoding="utf-8", errors="ignore")
    return _split_text(text)


def extract_docx(file_path: str) -> list[DocumentChunk]:
    from docx import Document as DocxDocument

    doc = DocxDocument(file_path)
    text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    return _split_text(text)


async def process_document(document_id: str, file_path: str, file_type: str) -> int:
    """Extract, embed, and store document chunks. Returns chunk count."""
    ext = file_type.lower()

    if ext == "pdf":
        chunks = extract_pdf(file_path)
    elif ext in {"txt", "csv"}:
        chunks = extract_text_file(file_path)
    elif ext == "docx":
        chunks = extract_docx(file_path)
    else:
        chunks = extract_text_file(file_path) if Path(file_path).exists() else []

    if not chunks:
        return 0

    from embeddings.service import embed_and_store

    return await embed_and_store(document_id=document_id, chunks=chunks)
