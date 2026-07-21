"""Authentication business logic."""

import json
import time
import urllib.request

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.models.user import User, UserRole
from app.schemas import TokenResponse, UserCreate, UserResponse


#region debug-point A:service-reporting
def _report_debug_event(hypothesis_id: str, msg: str, data: dict | None = None) -> None:
    try:
        debug_url = "http://127.0.0.1:7777/event"
        session_id = "register-500-error"
        with open(".dbg/register-500-error.env", "r", encoding="utf-8") as env_file:
            for line in env_file:
                if line.startswith("DEBUG_SERVER_URL="):
                    debug_url = line.split("=", 1)[1].strip() or debug_url
                elif line.startswith("DEBUG_SESSION_ID="):
                    session_id = line.split("=", 1)[1].strip() or session_id
        payload = {
            "sessionId": session_id,
            "runId": "pre-fix",
            "hypothesisId": hypothesis_id,
            "location": "backend/app/services/auth_service.py",
            "msg": f"[DEBUG] {msg}",
            "data": data or {},
            "ts": int(time.time() * 1000),
        }
        request = urllib.request.Request(
            debug_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        urllib.request.urlopen(request, timeout=2).read()
    except Exception:
        pass
#endregion


class AuthService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def register(self, data: UserCreate) -> UserResponse:
        email = str(data.email).strip().lower()
        full_name = data.full_name.strip()

        #region debug-point A:register-service-entry
        _report_debug_event("A", "auth service register started", {"email": email, "full_name_length": len(full_name)})
        #endregion
        existing = await self.db.execute(select(User).where(User.email == email))
        if existing.scalar_one_or_none():
            #region debug-point A:register-existing-user
            _report_debug_event("A", "existing user found during register", {"email": email})
            #endregion
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        user = User(
            email=email,
            full_name=full_name,
            hashed_password=hash_password(data.password),
            role=UserRole.USER,
        )
        #region debug-point B:register-before-flush
        _report_debug_event("B", "user object created before flush", {"email": email, "role": user.role.value})
        #endregion
        self.db.add(user)
        await self.db.flush()
        #region debug-point C:register-after-flush
        _report_debug_event("C", "db flush completed", {"email": email, "user_id": str(user.id)})
        #endregion
        await self.db.refresh(user)
        #region debug-point C:register-after-refresh
        _report_debug_event("C", "db refresh completed", {"email": email, "user_id": str(user.id)})
        #endregion
        return UserResponse.model_validate(user)

    async def login(self, email: str, password: str) -> TokenResponse:
        normalized_email = email.strip().lower()
        result = await self.db.execute(select(User).where(User.email == normalized_email))
        user = result.scalar_one_or_none()
        if user is None or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")

        return TokenResponse(
            access_token=create_access_token(user.id, {"role": user.role.value}),
            refresh_token=create_refresh_token(user.id),
        )
