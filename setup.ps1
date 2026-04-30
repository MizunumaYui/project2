# Character EC Application Setup Script for Windows PowerShell
# Docker Compose to start Next.js and Rails with database initialization

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Character EC Application Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Docker Build and Start
Write-Host "[1/4] Starting Docker containers..." -ForegroundColor Yellow

docker-compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start Docker." -ForegroundColor Red
    exit 1
}

Write-Host "OK: Docker containers started" -ForegroundColor Green
Write-Host ""

# Step 2: Backend Health Check
Write-Host "[2/4] Waiting for backend (max 60 seconds)..." -ForegroundColor Yellow

$maxAttempts = 60
$attempt = 0
$backendReady = $false

while ($attempt -lt $maxAttempts) {
    try {
        $response = docker-compose exec -T backend curl -s http://localhost:3001 2>$null
        if ($response) {
            $backendReady = $true
            break
        }
    } catch {
        # Error ignored, continue
    }
    
    $attempt++
    Start-Sleep -Seconds 1
    
    if ($attempt % 10 -eq 0) {
        Write-Host "  Waiting... ($($attempt) seconds)" -ForegroundColor Gray
    }
}

if ($backendReady) {
    Write-Host "OK: Backend is ready" -ForegroundColor Green
} else {
    Write-Host "WARNING: Backend response not confirmed, but continuing..." -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Database Migration
Write-Host "[3/4] Running database migrations..." -ForegroundColor Yellow

docker-compose exec -T backend bundle exec rails db:migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Migration failed." -ForegroundColor Red
    exit 1
}

Write-Host "OK: Migrations completed" -ForegroundColor Green
Write-Host ""

# Step 4: Seed Initial Data
Write-Host "[4/4] Seeding initial data..." -ForegroundColor Yellow

docker-compose exec -T backend bundle exec rails db:seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Seed failed." -ForegroundColor Red
    exit 1
}

Write-Host "OK: Initial data seeded" -ForegroundColor Green
Write-Host ""

# Completion Message
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend API: http://localhost:3001" -ForegroundColor Green
Write-Host "  PostgreSQL: localhost:5432" -ForegroundColor Green
Write-Host "  MinIO Console: http://localhost:9001" -ForegroundColor Green
Write-Host ""
Write-Host "Test Accounts:" -ForegroundColor Cyan
Write-Host "  User: user@example.com / password123" -ForegroundColor Green
Write-Host "  Admin: admin@example.com / password123" -ForegroundColor Green
Write-Host ""
Write-Host "View Logs:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f backend" -ForegroundColor Gray
Write-Host "  docker-compose logs -f frontend" -ForegroundColor Gray
Write-Host ""
Write-Host "Stop Containers:" -ForegroundColor Cyan
Write-Host "  docker-compose down" -ForegroundColor Gray
Write-Host ""
