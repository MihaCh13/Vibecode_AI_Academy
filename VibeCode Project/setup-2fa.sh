#!/bin/bash

# AI Tools Platform - 2FA Setup Script
# This script helps set up the Two-Factor Authentication system

echo "🚀 AI Tools Platform - 2FA Setup"
echo "================================="
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

print_status "Starting 2FA setup process..."

# Step 1: Backend Dependencies
print_status "Installing backend dependencies..."
cd backend

if command -v composer &> /dev/null; then
    composer install
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
else
    print_warning "Composer not found. Please install Composer and run 'composer install' in the backend directory"
fi

# Step 2: Run Migrations
print_status "Running database migrations..."
if command -v php &> /dev/null; then
    php artisan migrate
    if [ $? -eq 0 ]; then
        print_success "Database migrations completed successfully"
    else
        print_warning "Failed to run migrations. Please ensure your database is configured and run 'php artisan migrate'"
    fi
else
    print_warning "PHP not found. Please install PHP and run 'php artisan migrate' in the backend directory"
fi

cd ..

# Step 3: Frontend Dependencies
print_status "Installing frontend dependencies..."
cd frontend

if command -v npm &> /dev/null; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    print_warning "npm not found. Please install Node.js and run 'npm install' in the frontend directory"
fi

cd ..

# Step 4: Environment Configuration
print_status "Checking environment configuration..."

# Check backend .env
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        print_warning "Backend .env file not found. Please copy .env.example to .env and configure it"
        print_status "Run: cp backend/.env.example backend/.env"
    else
        print_error "Backend .env.example file not found"
    fi
else
    print_success "Backend .env file found"
fi

# Check frontend .env
if [ ! -f "frontend/.env.local" ]; then
    print_warning "Frontend .env.local file not found. Please create it with your configuration"
    print_status "Example content:"
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000"
else
    print_success "Frontend .env.local file found"
fi

# Step 5: Configuration Instructions
echo ""
print_status "Configuration Instructions:"
echo "================================"
echo ""
echo "1. Backend Configuration (backend/.env):"
echo "   - Set your database connection details"
echo "   - Configure SMTP for email 2FA:"
echo "     MAIL_MAILER=smtp"
echo "     MAIL_HOST=your_smtp_host"
echo "     MAIL_PORT=587"
echo "     MAIL_USERNAME=your_email"
echo "     MAIL_PASSWORD=your_password"
echo ""
echo "   - Configure Telegram bot (optional):"
echo "     TELEGRAM_BOT_TOKEN=your_bot_token"
echo "     TELEGRAM_BOT_USERNAME=your_bot_username"
echo ""
echo "   - Set frontend URL:"
echo "     FRONTEND_URL=http://localhost:3000"
echo ""
echo "2. Frontend Configuration (frontend/.env.local):"
echo "   - Set API URL:"
echo "     NEXT_PUBLIC_API_URL=http://localhost:8000"
echo ""

# Step 6: Telegram Bot Setup (Optional)
print_status "Telegram Bot Setup (Optional):"
echo "=================================="
echo ""
echo "To enable Telegram 2FA:"
echo "1. Message @BotFather on Telegram"
echo "2. Create a new bot with /newbot"
echo "3. Save the bot token"
echo "4. Add token to backend/.env file"
echo "5. Set webhook URL for production use"
echo ""

# Step 7: Testing Instructions
print_status "Testing Instructions:"
echo "========================"
echo ""
echo "1. Start the backend server:"
echo "   cd backend && php artisan serve"
echo ""
echo "2. Start the frontend server:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Navigate to http://localhost:3000"
echo ""
echo "4. Test 2FA functionality:"
echo "   - Register a new user"
echo "   - Go to Profile → Two-Factor Authentication"
echo "   - Enable any 2FA method"
echo "   - Test login with 2FA"
echo ""

# Step 8: Security Checklist
print_status "Security Checklist:"
echo "===================="
echo ""
echo "Before going to production:"
echo "✓ Use HTTPS for all communication"
echo "✓ Set strong SMTP credentials"
echo "✓ Use secure Telegram bot tokens"
echo "✓ Enable rate limiting"
echo "✓ Monitor authentication logs"
echo "✓ Regular security updates"
echo ""

print_success "2FA setup script completed!"
echo ""
print_status "Next steps:"
echo "1. Configure your .env files"
echo "2. Start the servers"
echo "3. Test the 2FA functionality"
echo "4. Review the documentation in docs/2FA_SETUP.md"
echo ""
print_warning "Remember to test all 2FA methods before deploying to production!"
echo ""
