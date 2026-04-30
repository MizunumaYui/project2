# Stop Docker Containers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Stopping Docker Containers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Containers stopped" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to stop" -ForegroundColor Red
}
