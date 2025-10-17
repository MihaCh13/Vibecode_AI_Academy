# AI Tools Platform Setup Script for Windows

Write-Host "🚀 Setting up AI Tools Platform..." -ForegroundColor Green

# Create .env files
Write-Host "📝 Creating environment files..." -ForegroundColor Yellow
Copy-Item "backend/env.example" "backend/.env" -Force
Copy-Item "frontend/env.example" "frontend/.env.local" -Force

Write-Host "✅ Environment files created!" -ForegroundColor Green

# Build and start containers
Write-Host "🐳 Building and starting Docker containers..." -ForegroundColor Yellow
docker-compose build

# Generate Laravel application key
Write-Host "🔑 Generating Laravel application key..." -ForegroundColor Yellow
docker-compose run --rm app php artisan key:generate

# Install dependencies
Write-Host "📦 Installing Laravel dependencies..." -ForegroundColor Yellow
docker-compose run --rm app composer install

Write-Host "📦 Installing Next.js dependencies..." -ForegroundColor Yellow
docker-compose run --rm frontend npm install

# Run database migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
docker-compose run --rm app php artisan migrate

# Seed the database
Write-Host "🌱 Seeding database with sample users..." -ForegroundColor Yellow
docker-compose run --rm app php artisan db:seed

# Build frontend
Write-Host "🏗️ Building frontend..." -ForegroundColor Yellow
docker-compose run --rm frontend npm run build

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your AI Tools Platform is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Available services:" -ForegroundColor Cyan
Write-Host "   • Laravel API: http://localhost:8000" -ForegroundColor White
Write-Host "   • Next.js Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   • MySQL Database: localhost:3306" -ForegroundColor White
Write-Host ""
Write-Host "👥 Test accounts:" -ForegroundColor Cyan
Write-Host "   • Owner: ivan@admin.local / password" -ForegroundColor White
Write-Host "   • Backend: petar@backend.local / password" -ForegroundColor White
Write-Host "   • Frontend: elena@frontend.local / password" -ForegroundColor White
Write-Host "   • PM: maria@pm.local / password" -ForegroundColor White
Write-Host "   • QA: nikolay@qa.local / password" -ForegroundColor White
Write-Host "   • Designer: sofia@designer.local / password" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Start the application with: docker-compose up" -ForegroundColor Green
