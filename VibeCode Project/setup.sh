#!/bin/bash

echo "🚀 Setting up AI Tools Platform..."

# Create .env files
echo "📝 Creating environment files..."
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env.local

# Generate Laravel application key
echo "🔑 Generating Laravel application key..."
docker-compose run --rm app php artisan key:generate

# Install dependencies
echo "📦 Installing Laravel dependencies..."
docker-compose run --rm app composer install

echo "📦 Installing Next.js dependencies..."
docker-compose run --rm frontend npm install

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose run --rm app php artisan migrate

# Seed the database
echo "🌱 Seeding database with sample users..."
docker-compose run --rm app php artisan db:seed

# Build frontend
echo "🏗️ Building frontend..."
docker-compose run --rm frontend npm run build

echo "✅ Setup complete!"
echo ""
echo "🎉 Your AI Tools Platform is ready!"
echo ""
echo "📋 Available services:"
echo "   • Laravel API: http://localhost:8000"
echo "   • Next.js Frontend: http://localhost:3000"
echo "   • MySQL Database: localhost:3306"
echo ""
echo "👥 Test accounts:"
echo "   • Owner: ivan@admin.local / password"
echo "   • Backend: petar@backend.local / password"
echo "   • Frontend: elena@frontend.local / password"
echo "   • PM: maria@pm.local / password"
echo "   • QA: nikolay@qa.local / password"
echo "   • Designer: sofia@designer.local / password"
echo ""
echo "🚀 Start the application with: docker-compose up"
