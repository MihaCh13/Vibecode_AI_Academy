#!/bin/bash

# AI Tools Platform - Complete Docker Rebuild Script
# This script completely rebuilds the project using Docker containers

echo "🐳 AI Tools Platform - Complete Docker Rebuild"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from the project root directory (where docker-compose.yml is located)"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Starting complete Docker rebuild process..."

# Step 1: Stop and remove all containers, networks, and volumes
print_status "Stopping and removing existing containers..."
docker-compose down -v --remove-orphans

print_status "Removing all project-related images..."
docker-compose down --rmi all --remove-orphans

# Step 2: Clean Docker system
print_status "Cleaning Docker system..."
docker system prune -f
docker volume prune -f
docker network prune -f

# Step 3: Remove specific images if they exist
print_status "Removing old project images..."
docker rmi ai-tools-platform_app ai-tools-platform_frontend ai-tools-platform_db ai-tools-platform_nginx 2>/dev/null || true
docker rmi $(docker images -q --filter "reference=*ai-tools-platform*") 2>/dev/null || true

# Step 4: Build fresh containers
print_status "Building fresh Docker containers..."
docker-compose build --no-cache --pull

if [ $? -eq 0 ]; then
    print_success "Docker containers built successfully"
else
    print_error "Failed to build Docker containers"
    exit 1
fi

# Step 5: Start the containers
print_status "Starting Docker containers..."
docker-compose up -d

if [ $? -eq 0 ]; then
    print_success "Docker containers started successfully"
else
    print_error "Failed to start Docker containers"
    exit 1
fi

# Step 6: Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Step 7: Check container status
print_status "Checking container status..."
docker-compose ps

# Step 8: Install backend dependencies and run migrations
print_status "Setting up backend in Docker container..."

# Wait for database to be ready
print_status "Waiting for database to be ready..."
for i in {1..30}; do
    if docker-compose exec -T db mysqladmin ping -h localhost --silent; then
        print_success "Database is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_warning "Database might not be ready, but continuing..."
    fi
    sleep 2
done

# Install backend dependencies
print_status "Installing backend dependencies..."
docker-compose exec -T app composer install --optimize-autoloader

# Generate application key
print_status "Generating application key..."
docker-compose exec -T app php artisan key:generate --force

# Clear and cache config
print_status "Optimizing backend..."
docker-compose exec -T app php artisan config:clear
docker-compose exec -T app php artisan config:cache
docker-compose exec -T app php artisan route:clear
docker-compose exec -T app php artisan route:cache
docker-compose exec -T app php artisan view:clear
docker-compose exec -T app php artisan view:cache

# Run migrations
print_status "Running database migrations..."
docker-compose exec -T app php artisan migrate --force

# Seed database
print_status "Seeding database..."
docker-compose exec -T app php artisan db:seed --force

# Set permissions
print_status "Setting permissions..."
docker-compose exec -T app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec -T app chmod -R 775 storage bootstrap/cache

# Step 9: Install frontend dependencies
print_status "Installing frontend dependencies..."
docker-compose exec -T frontend npm install

# Build frontend
print_status "Building frontend..."
docker-compose exec -T frontend npm run build

# Step 10: Final status check
print_status "Performing final status check..."

# Check if all containers are running
CONTAINERS_RUNNING=$(docker-compose ps --services --filter "status=running" | wc -l)
TOTAL_CONTAINERS=$(docker-compose config --services | wc -l)

if [ "$CONTAINERS_RUNNING" -eq "$TOTAL_CONTAINERS" ]; then
    print_success "All containers are running successfully"
else
    print_warning "Some containers might not be running properly"
fi

# Show container status
echo ""
print_status "Container Status:"
docker-compose ps

# Show logs for any failed containers
FAILED_CONTAINERS=$(docker-compose ps --services --filter "status=exited")
if [ ! -z "$FAILED_CONTAINERS" ]; then
    echo ""
    print_warning "Some containers have exited. Checking logs..."
    for container in $FAILED_CONTAINERS; do
        echo "Logs for $container:"
        docker-compose logs --tail=20 $container
    done
fi

# Step 11: Final success message
echo ""
print_success "🎉 Docker rebuild completed!"
echo ""
print_status "Access Points:"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "🗄️  Database: localhost:3306"
echo "📊 phpMyAdmin: http://localhost:8080"
echo ""
print_status "Test Accounts:"
echo "👑 Owner: ivan@admin.local (password: password)"
echo "⚙️  Backend: petar@backend.local (password: password)"
echo "🎨 Frontend: elena@frontend.local (password: password)"
echo "📋 PM: maria@pm.local (password: password)"
echo "🔍 QA: nikolay@qa.local (password: password)"
echo "🎭 Designer: sofia@designer.local (password: password)"
echo ""
print_status "2FA Features:"
echo "📧 Email 2FA - Configure SMTP in backend/.env"
echo "📱 Telegram 2FA - Set TELEGRAM_BOT_TOKEN in backend/.env"
echo "🔐 Google Authenticator - QR code setup available"
echo ""
print_warning "Next steps:"
echo "1. Configure your backend/.env file for email/telegram settings"
echo "2. Test login with any test account"
echo "3. Go to Profile → Two-Factor Authentication to test 2FA"
echo "4. Check logs if any issues: docker-compose logs [service_name]"
echo ""
print_status "Useful commands:"
echo "📋 View logs: docker-compose logs -f [service_name]"
echo "🔄 Restart service: docker-compose restart [service_name]"
echo "🛑 Stop all: docker-compose down"
echo "🚀 Start all: docker-compose up -d"
echo ""
