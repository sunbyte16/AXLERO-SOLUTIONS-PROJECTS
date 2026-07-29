"""Authentication API routes."""

import time

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clients import get_redis
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas import TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()

_RATE_LIMIT_WINDOW: dict[str, tuple[int, float]] = {}


async def _enforce_rate_limit(*, key: str, limit: int, window_seconds: int) -> None:
    try:
        redis = await get_redis()
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, window_seconds)
        if count > limit:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")
        return
    except HTTPException:
        raise
    except Exception:
        now = time.monotonic()
        current, reset_at = _RATE_LIMIT_WINDOW.get(key, (0, 0.0))
        if now >= reset_at:
            current, reset_at = 0, now + window_seconds
        current += 1
        _RATE_LIMIT_WINDOW[key] = (current, reset_at)
        if current > limit:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(
    request: Request,
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    ip = request.client.host if request.client else "unknown"
    email = str(data.email).strip().lower()
    await _enforce_rate_limit(key=f"rl:register:{ip}:{email}", limit=120, window_seconds=60)
    return await AuthService(db).register(data)


@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    ip = request.client.host if request.client else "unknown"
    email = str(data.email).strip().lower()
    await _enforce_rate_limit(key=f"rl:login:{ip}:{email}", limit=300, window_seconds=60)
    return await AuthService(db).login(data.email, data.password)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)

