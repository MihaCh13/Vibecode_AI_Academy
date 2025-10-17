# AI Tools Platform - Complete Docker Rebuild Script (PowerShell)
# This script completely rebuilds the project using Docker containers

Write-Host "🐳 AI Tools Platform - Complete Docker Rebuild" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if we're in the right directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Error "Please run this script from the project root directory (where docker-compose.yml is located)"
    exit 1
}

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed. Please install Docker first."
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

Write-Status "Starting complete Docker rebuild process..."

# Step 1: Stop and remove all containers, networks, and volumes
Write-Status "Stopping and removing existing containers..."
docker-compose down -v --remove-orphans

Write-Status "Removing all project-related images..."
docker-compose down --rmi all --remove-orphans

# Step 2: Clean Docker system
Write-Status "Cleaning Docker system..."
docker system prune -f
docker volume prune -f
docker network prune -f

# Step 3: Remove specific images if they exist
Write-Status "Removing old project images..."
docker rmi ai-tools-platform_app ai-tools-platform_frontend ai-tools-platform_db ai-tools-platform_nginx 2>$null
docker rmi (docker images -q --filter "reference=*ai-tools-platform*") 2>$null

# Step 4: Build fresh containers
Write-Status "Building fresh Docker containers..."
docker-compose build --no-cache --pull

if ($LASTEXITCODE -eq 0) {
    Write-Success "Docker containers built successfully"
} else {
    Write-Error "Failed to build Docker containers"
    exit 1
}

# Step 5: Start the containers
Write-Status "Starting Docker containers..."
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Success "Docker containers started successfully"
} else {
    Write-Error "Failed to start Docker containers"
    exit 1
}

# Step 6: Wait for services to be ready
Write-Status "Waiting for services to be ready..."
Start-Sleep -Seconds 10

# Step 7: Check container status
Write-Status "Checking container status..."
docker-compose ps

# Step 8: Install backend dependencies and run migrations
Write-Status "Setting up backend in Docker container..."

# Wait for database to be ready
Write-Status "Waiting for database to be ready..."
for ($i = 1; $i -le 30; $i++) {
    try {
        docker-compose exec -T db mysqladmin ping -h localhost --silent 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Database is ready"
            break
        }
    } catch {
        # Continue waiting
    }
    if ($i -eq 30) {
        Write-Warning "Database might not be ready, but continuing..."
    }
    Start-Sleep -Seconds 2
}

# Install backend dependencies
Write-Status "Installing backend dependencies..."
docker-compose exec -T app composer install --optimize-autoloader

# Generate application key
Write-Status "Generating application key..."
docker-compose exec -T app php artisan key:generate --force

# Clear and cache config
Write-Status "Optimizing backend..."
docker-compose exec -T app php artisan config:clear
docker-compose exec -T app php artisan config:cache
docker-compose exec -T app php artisan route:clear
docker-compose exec -T app php artisan route:cache
docker-compose exec -T app php artisan view:clear
docker-compose exec -T app php artisan view:cache

# Run migrations
Write-Status "Running database migrations..."
docker-compose exec -T app php artisan migrate --force

# Seed database
Write-Status "Seeding database..."
docker-compose exec -T app php artisan db:seed --force

# Set permissions
Write-Status "Setting permissions..."
docker-compose exec -T app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec -T app chmod -R 775 storage bootstrap/cache

# Step 9: Install frontend dependencies
Write-Status "Installing frontend dependencies..."
docker-compose exec -T frontend npm install

# Build frontend
Write-Status "Building frontend..."
docker-compose exec -T frontend npm run build

# Step 10: Final status check
Write-Status "Performing final status check..."

# Check if all containers are running
$containersRunning = (docker-compose ps --services --filter "status=running" | Measure-Object -Line).Lines
$totalContainers = (docker-compose config --services | Measure-Object -Line).Lines

if ($containersRunning -eq $totalContainers) {
    Write-Success "All containers are running successfully"
} else {
    Write-Warning "Some containers might not be running properly"
}

# Show container status
Write-Host ""
Write-Status "Container Status:"
docker-compose ps

# Show logs for any failed containers
$failedContainers = docker-compose ps --services --filter "status=exited"
if ($failedContainers) {
    Write-Host ""
    Write-Warning "Some containers have exited. Checking logs..."
    foreach ($container in $failedContainers) {
        Write-Host "Logs for ${container}:"
        docker-compose logs --tail=20 $container
    }
}

# Step 11: Final success message
Write-Host ""
Write-Success "🎉 Docker rebuild completed!"
Write-Host ""
Write-Status "Access Points:"
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "🗄️  Database: localhost:3306" -ForegroundColor Green
Write-Host "📊 phpMyAdmin: http://localhost:8080" -ForegroundColor Green
Write-Host ""
Write-Status "Test Accounts:"
Write-Host "👑 Owner: ivan@admin.local (password: password)" -ForegroundColor Yellow
Write-Host "⚙️  Backend: petar@backend.local (password: password)" -ForegroundColor Yellow
Write-Host "🎨 Frontend: elena@frontend.local (password: password)" -ForegroundColor Yellow
Write-Host "📋 PM: maria@pm.local (password: password)" -ForegroundColor Yellow
Write-Host "🔍 QA: nikolay@qa.local (password: password)" -ForegroundColor Yellow
Write-Host "🎭 Designer: sofia@designer.local (password: password)" -ForegroundColor Yellow
Write-Host ""
Write-Status "2FA Features:"
Write-Host "📧 Email 2FA - Configure SMTP in backend/.env" -ForegroundColor Cyan
Write-Host "📱 Telegram 2FA - Set TELEGRAM_BOT_TOKEN in backend/.env" -ForegroundColor Cyan
Write-Host "🔐 Google Authenticator - QR code setup available" -ForegroundColor Cyan
Write-Host ""
Write-Warning "Next steps:"
Write-Host "1. Configure your backend/.env file for email/telegram settings"
Write-Host "2. Test login with any test account"
Write-Host "3. Go to Profile → Two-Factor Authentication to test 2FA"
Write-Host "4. Check logs if any issues: docker-compose logs [service_name]"
Write-Host ""
Write-Status "Useful commands:"
Write-Host "📋 View logs: docker-compose logs -f [service_name]" -ForegroundColor Gray
Write-Host "🔄 Restart service: docker-compose restart [service_name]" -ForegroundColor Gray
Write-Host "🛑 Stop all: docker-compose down" -ForegroundColor Gray
Write-Host "🚀 Start all: docker-compose up -d" -ForegroundColor Gray
Write-Host ""
