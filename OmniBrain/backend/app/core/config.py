"""Application configuration."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent


def _default_storage_path() -> str:
    docker_storage = BACKEND_ROOT / "storage" / "uploads"
    if docker_storage.parent.exists():
        return str(docker_storage)
    return str(PROJECT_ROOT / "storage" / "uploads")


def _default_local_db_path() -> str:
    return str(BACKEND_ROOT / "omnibrain.db")


class Settings(BaseSettings):
    """Central application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_NAME: str = "OmniBrain"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_SECRET_KEY: str = "change-me"

    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173"

    DATABASE_URL: str | None = None

    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "omnibrain"
    POSTGRES_PASSWORD: str = "omnibrain_secret"
    POSTGRES_DB: str = "omnibrain"

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0

    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION: str = "omnibrain_documents"

    JWT_SECRET_KEY: str = "change-me-jwt"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    LLM_PROVIDER: str = "auto"

    STORAGE_PATH: str = _default_storage_path()
    LOCAL_SQLITE_PATH: str = _default_local_db_path()
    MAX_UPLOAD_SIZE_MB: int = 50

    LOG_LEVEL: str = "INFO"

    @property
    def active_llm_provider(self) -> str:
        if self.LLM_PROVIDER.lower() in {"openai", "gemini"}:
            return self.LLM_PROVIDER.lower()
        if self.GEMINI_API_KEY and not self.OPENAI_API_KEY:
            return "gemini"
        return "openai"

    @property
    def has_api_key(self) -> bool:
        return bool(self.OPENAI_API_KEY or self.GEMINI_API_KEY)

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def local_sqlite_url(self) -> str:
        return f"sqlite+aiosqlite:///{self.LOCAL_SQLITE_PATH}"

    @property
    def can_fallback_to_local_sqlite(self) -> bool:
        return (
            self.APP_ENV == "development"
            and not self.DATABASE_URL
            and self.POSTGRES_HOST in {"localhost", "127.0.0.1"}
        )

    @property
    def redis_url(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def max_upload_size_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
