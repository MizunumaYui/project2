# Clean Up - Delete all Docker containers, images, and volumes

Write-Host "========================================" -ForegroundColor Red
Write-Host "WARNING: Complete Docker Cleanup" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "This will delete:" -ForegroundColor Yellow
Write-Host "  - All Docker containers" -ForegroundColor Yellow
Write-Host "  - All Docker images" -ForegroundColor Yellow
Write-Host "  - All Docker volumes (DATABASE DATA)" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Are you sure? Type 'yes' to confirm"

if ($confirmation -eq "yes") {
    Write-Host ""
    Write-Host "Running cleanup..." -ForegroundColor Cyan
    
    docker-compose down -v
    docker system prune -a -f
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Cleanup complete" -ForegroundColor Green
        Write-Host "Run: .\setup.ps1" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Cleanup failed" -ForegroundColor Red
    }
} else {
    Write-Host "Cancelled" -ForegroundColor Gray
}
