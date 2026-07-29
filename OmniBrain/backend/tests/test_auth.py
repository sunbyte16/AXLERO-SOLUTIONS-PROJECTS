"""Authentication tests."""

import uuid
import pytest
from httpx import ASGITransport, AsyncClient

from app.core.database import init_db
from app.main import app


@pytest.mark.asyncio
async def test_user_registration_and_login() -> None:
    await init_db()
    test_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "SecurePassword123!"

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Register a new user
        reg_payload = {
            "email": test_email,
            "password": test_password,
            "full_name": "QA Test User",
        }
        reg_resp = await client.post("/api/auth/register", json=reg_payload)
        assert reg_resp.status_code == 201

        # Login with created user
        login_payload = {
            "email": test_email,
            "password": test_password,
        }
        login_resp = await client.post("/api/auth/login", json=login_payload)
        assert login_resp.status_code == 200
        token_data = login_resp.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"

        # Verify /me endpoint with token
        headers = {"Authorization": f"Bearer {token_data['access_token']}"}
        me_resp = await client.get("/api/auth/me", headers=headers)
        assert me_resp.status_code == 200
        me_data = me_resp.json()
        assert me_data["email"] == test_email

