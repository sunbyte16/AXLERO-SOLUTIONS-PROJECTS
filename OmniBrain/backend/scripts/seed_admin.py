#!/usr/bin/env python3
"""Script to seed an admin user into the database."""

import asyncio
import argparse
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import AsyncSessionLocal, init_db
from app.models.user import User, UserRole
from app.core.security import hash_password


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--admin-email", default="admin@omnibrain.io")
    parser.add_argument("--admin-password", default="Admin123!")
    parser.add_argument("--users-count", type=int, default=0)
    parser.add_argument("--users-email-domain", default="example.com")
    parser.add_argument("--users-password", default="User123!")
    return parser.parse_args()


async def seed_admin() -> None:
    args = _parse_args()
    await init_db()
    
    async with AsyncSessionLocal() as session:
        from sqlalchemy import select
        admin_email = args.admin_email.strip().lower()
        result = await session.execute(select(User).where(User.email == admin_email))
        existing_admin = result.scalar_one_or_none()
        
        if not existing_admin:
            admin = User(
                email=admin_email,
                full_name="Admin User",
                hashed_password=hash_password(args.admin_password),
                role=UserRole.ADMIN,
                is_active=True,
            )
            session.add(admin)
            await session.commit()
            await session.refresh(admin)

            print("\n✅ Admin user created successfully!")
            print(f"Email: {admin_email}")
            print(f"Password: {args.admin_password}")
        else:
            print(f"Admin user already exists: {existing_admin.email}")

        users_count = max(0, int(args.users_count))
        if users_count:
            emails = [f"user{i}@{args.users_email_domain}".lower() for i in range(1, users_count + 1)]
            existing = await session.execute(select(User.email).where(User.email.in_(emails)))
            existing_emails = {row[0] for row in existing.all()}

            batch: list[User] = []
            created = 0
            for i, email in enumerate(emails, start=1):
                if email in existing_emails:
                    continue
                batch.append(
                    User(
                        email=email,
                        full_name=f"User {i}",
                        hashed_password=hash_password(args.users_password),
                        role=UserRole.USER,
                        is_active=True,
                    )
                )
                if len(batch) >= 200:
                    session.add_all(batch)
                    await session.commit()
                    created += len(batch)
                    batch = []

            if batch:
                session.add_all(batch)
                await session.commit()
                created += len(batch)

            print(f"\n✅ Created {created} demo users")
            print(f"Password for demo users: {args.users_password}")


if __name__ == "__main__":
    asyncio.run(seed_admin())
