# Database Reseed - Delete and reinject initial data

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Reseed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Reseeding database..." -ForegroundColor Yellow

docker-compose exec -T backend bundle exec rails db:seed:replant

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Reseed complete" -ForegroundColor Green
} else {
    Write-Host "Trying alternative seed method..." -ForegroundColor Yellow
    docker-compose exec -T backend bundle exec rails db:seed
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Seed complete" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Seed failed" -ForegroundColor Red
    }
}
