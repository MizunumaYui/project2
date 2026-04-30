# Rails Interactive Console

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Rails Console" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Launching Rails console..." -ForegroundColor Yellow
Write-Host "Type 'exit' or Ctrl+D to quit" -ForegroundColor Gray
Write-Host ""

docker-compose exec backend bundle exec rails console
