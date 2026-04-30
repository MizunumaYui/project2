# Quick Start - Start containers without DB setup

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker Compose Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Containers started" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
    Write-Host "Backend API: http://localhost:3001" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to start" -ForegroundColor Red
}
