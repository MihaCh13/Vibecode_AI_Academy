#!/bin/bash

# AI Tools Platform - Complete Rebuild Script
# This script completely rebuilds the project from scratch

echo "🚀 AI Tools Platform - Complete Rebuild"
echo "======================================="
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
if [ ! -f "backend/composer.json" ] || [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting complete rebuild process..."

# Step 1: Clean Docker containers (if using Docker)
print_status "Cleaning Docker containers..."
if command -v docker &> /dev/null; then
    docker-compose down -v 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    print_success "Docker containers cleaned"
else
    print_warning "Docker not found, skipping Docker cleanup"
fi

# Step 2: Backend Cleanup and Rebuild
print_status "Rebuilding backend..."
cd backend

# Clean vendor directory
if [ -d "vendor" ]; then
    rm -rf vendor
    print_status "Removed vendor directory"
fi

# Clean cache
if [ -d "bootstrap/cache" ]; then
    rm -rf bootstrap/cache/*
    print_status "Cleared bootstrap cache"
fi

# Clean storage cache
if [ -d "storage/framework/cache" ]; then
    rm -rf storage/framework/cache/*
    print_status "Cleared storage cache"
fi

# Install dependencies
if command -v composer &> /dev/null; then
    print_status "Installing backend dependencies..."
    composer install --no-dev --optimize-autoloader
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
else
    print_error "Composer not found. Please install Composer first."
    exit 1
fi

# Generate application key
if command -v php &> /dev/null; then
    print_status "Generating application key..."
    php artisan key:generate --force
    
    # Clear and cache config
    php artisan config:clear
    php artisan config:cache
    
    # Clear and cache routes
    php artisan route:clear
    php artisan route:cache
    
    # Clear and cache views
    php artisan view:clear
    php artisan view:cache
    
    print_success "Backend optimized"
else
    print_error "PHP not found. Please install PHP first."
    exit 1
fi

cd ..

# Step 3: Frontend Cleanup and Rebuild
print_status "Rebuilding frontend..."
cd frontend

# Clean node_modules
if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_status "Removed node_modules directory"
fi

# Clean .next directory
if [ -d ".next" ]; then
    rm -rf .next
    print_status "Removed .next directory"
fi

# Install dependencies
if command -v npm &> /dev/null; then
    print_status "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    print_error "npm not found. Please install Node.js first."
    exit 1
fi

# Build frontend
print_status "Building frontend..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_warning "Frontend build failed, but continuing..."
fi

cd ..

# Step 4: Database Setup
print_status "Setting up database..."
cd backend

if command -v php &> /dev/null; then
    # Run migrations
    print_status "Running database migrations..."
    php artisan migrate --force
    if [ $? -eq 0 ]; then
        print_success "Database migrations completed successfully"
    else
        print_warning "Database migrations failed. Please check your database configuration."
    fi
    
    # Seed database (optional)
    print_status "Seeding database..."
    php artisan db:seed --force
    if [ $? -eq 0 ]; then
        print_success "Database seeded successfully"
    else
        print_warning "Database seeding failed, but continuing..."
    fi
else
    print_error "PHP not found. Cannot run migrations."
fi

cd ..

# Step 5: Environment Configuration Check
print_status "Checking environment configuration..."

# Check backend .env
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        print_warning "Backend .env file not found. Creating from .env.example..."
        cp backend/.env.example backend/.env
        print_warning "Please configure your .env file with proper settings"
    else
        print_error "Backend .env.example file not found"
    fi
else
    print_success "Backend .env file found"
fi

# Check frontend .env
if [ ! -f "frontend/.env.local" ]; then
    print_warning "Frontend .env.local file not found. Creating..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
    print_warning "Please configure your .env.local file if needed"
else
    print_success "Frontend .env.local file found"
fi

# Step 6: Permissions
print_status "Setting permissions..."
if [ -d "backend/storage" ]; then
    chmod -R 775 backend/storage
    chmod -R 775 backend/bootstrap/cache
    print_success "Storage permissions set"
fi

# Step 7: Final Status
echo ""
print_success "🎉 Rebuild completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Configure your .env files:"
echo "   - backend/.env (database, email, telegram settings)"
echo "   - frontend/.env.local (API URL)"
echo ""
echo "2. Start the servers:"
echo "   Backend:  cd backend && php artisan serve"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo ""
echo "4. Test accounts are available:"
echo "   - ivan@admin.local (Owner)"
echo "   - petar@backend.local (Backend)"
echo "   - elena@frontend.local (Frontend)"
echo "   - maria@pm.local (PM)"
echo "   - nikolay@qa.local (QA)"
echo "   - sofia@designer.local (Designer)"
echo "   Password for all: password"
echo ""
print_warning "Remember to test 2FA functionality after login!"
echo ""
