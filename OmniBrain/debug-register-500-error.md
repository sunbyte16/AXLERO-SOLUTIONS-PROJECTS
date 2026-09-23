# Debug Session: register-500-error
- **Status**: [OPEN]
- **Issue**: Creating an account returns HTTP 500 from `/api/auth/register`
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-register-500-error.ndjson

## Reproduction Steps
1. Open the frontend registration page
2. Enter name, email, and password
3. Submit the form
4. Observe `Request failed with status code 500`

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | Registration fails because the DB schema for `users` is missing or incompatible | High | Low | Rejected. After SQLite fallback, tables created and registration succeeded with `201 Created`. |
| B | Password hashing or validation throws during user creation | Medium | Low | Rejected. Password hashing completed and user row inserted successfully. |
| C | DB commit / refresh fails due to connection or transaction issues | High | Medium | Rejected for post-fix path. Flush, refresh, and commit completed on SQLite. |
| D | Backend receives the request but raises an unhandled exception in `/api/auth/register` | High | Low | Rejected. Post-fix request completed normally with `201 Created`. |
| E | A recent DB compatibility change works in tests but breaks live registration | Medium | Medium | Confirmed in part. Local runtime failed before request handling because PostgreSQL was unavailable; startup needed a local fallback path. |

## Log Evidence
- Pre-fix: Uvicorn startup failed with `ConnectionRefusedError: [WinError 1225] The remote computer refused the network connection` while connecting to PostgreSQL.
- Pre-fix: Application exited during startup before serving registration requests.
- Post-fix: `database_initialized_with_sqlite_fallback` logged with `sqlite+aiosqlite:///.../backend/omnibrain.db`.
- Post-fix: `POST /api/auth/register HTTP/1.1` returned `201 Created`.
- Post-fix: Direct API registration returned a created user for `debuguser@example.com`.

## Verification Conclusion
- Root cause: local development backend depended on PostgreSQL at startup, and with PostgreSQL unavailable the backend could not serve registration.
- Fix applied: added a development-only automatic fallback to local SQLite when `POSTGRES_HOST` is local and PostgreSQL is unreachable.
- Result: backend starts locally, initializes schema, and registration succeeds.
