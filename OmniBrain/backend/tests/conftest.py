import os
import sys
import tempfile
from pathlib import Path

# Ensure project root and backend dir are in sys.path regardless of invocation directory
_backend_dir = Path(__file__).resolve().parent.parent
_project_root = _backend_dir.parent
for _p in [str(_project_root), str(_backend_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

# Create a fresh, isolated temporary SQLite database file for the test session
_temp_db_fd, _temp_db_path = tempfile.mkstemp(prefix="omnibrain_test_", suffix=".db")
os.close(_temp_db_fd)

os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{Path(_temp_db_path).as_posix()}"
os.environ["APP_ENV"] = "testing"

import pytest


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_db():
    """Teardown fixture to delete the isolated temporary SQLite database after test run finishes."""
    yield
    if os.path.exists(_temp_db_path):
        try:
            os.remove(_temp_db_path)
        except OSError:
            pass
