#!/usr/bin/env pwsh
# Start OmniBrain infrastructure services
docker compose up postgres redis qdrant -d
Write-Host "Infrastructure started. Run backend and frontend separately for local dev."
