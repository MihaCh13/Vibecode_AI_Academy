# AI Tools Platform - 2FA Setup Script (PowerShell)
# This script helps set up the Two-Factor Authentication system

Write-Host "🚀 AI Tools Platform - 2FA Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
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
if (-not (Test-Path "backend/composer.json") -or -not (Test-Path "frontend/package.json")) {
    Write-Error "Please run this script from the project root directory"
    exit 1
}

Write-Status "Starting 2FA setup process..."

# Step 1: Backend Dependencies
Write-Status "Installing backend dependencies..."
Set-Location backend

if (Get-Command composer -ErrorAction SilentlyContinue) {
    composer install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Backend dependencies installed successfully"
    } else {
        Write-Error "Failed to install backend dependencies"
        exit 1
    }
} else {
    Write-Warning "Composer not found. Please install Composer and run 'composer install' in the backend directory"
}

# Step 2: Run Migrations
Write-Status "Running database migrations..."
if (Get-Command php -ErrorAction SilentlyContinue) {
    php artisan migrate
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database migrations completed successfully"
    } else {
        Write-Warning "Failed to run migrations. Please ensure your database is configured and run 'php artisan migrate'"
    }
} else {
    Write-Warning "PHP not found. Please install PHP and run 'php artisan migrate' in the backend directory"
}

Set-Location ..

# Step 3: Frontend Dependencies
Write-Status "Installing frontend dependencies..."
Set-Location frontend

if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend dependencies installed successfully"
    } else {
        Write-Error "Failed to install frontend dependencies"
        exit 1
    }
} else {
    Write-Warning "npm not found. Please install Node.js and run 'npm install' in the frontend directory"
}

Set-Location ..

# Step 4: Environment Configuration
Write-Status "Checking environment configuration..."

# Check backend .env
if (-not (Test-Path "backend/.env")) {
    if (Test-Path "backend/.env.example") {
        Write-Warning "Backend .env file not found. Please copy .env.example to .env and configure it"
        Write-Status "Run: Copy-Item backend/.env.example backend/.env"
    } else {
        Write-Error "Backend .env.example file not found"
    }
} else {
    Write-Success "Backend .env file found"
}

# Check frontend .env
if (-not (Test-Path "frontend/.env.local")) {
    Write-Warning "Frontend .env.local file not found. Please create it with your configuration"
    Write-Status "Example content:"
    Write-Host "NEXT_PUBLIC_API_URL=http://localhost:8000" -ForegroundColor Gray
} else {
    Write-Success "Frontend .env.local file found"
}

# Step 5: Configuration Instructions
Write-Host ""
Write-Status "Configuration Instructions:"
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Backend Configuration (backend/.env):" -ForegroundColor Yellow
Write-Host "   - Set your database connection details"
Write-Host "   - Configure SMTP for email 2FA:"
Write-Host "     MAIL_MAILER=smtp" -ForegroundColor Gray
Write-Host "     MAIL_HOST=your_smtp_host" -ForegroundColor Gray
Write-Host "     MAIL_PORT=587" -ForegroundColor Gray
Write-Host "     MAIL_USERNAME=your_email" -ForegroundColor Gray
Write-Host "     MAIL_PASSWORD=your_password" -ForegroundColor Gray
Write-Host ""
Write-Host "   - Configure Telegram bot (optional):"
Write-Host "     TELEGRAM_BOT_TOKEN=your_bot_token" -ForegroundColor Gray
Write-Host "     TELEGRAM_BOT_USERNAME=your_bot_username" -ForegroundColor Gray
Write-Host ""
Write-Host "   - Set frontend URL:"
Write-Host "     FRONTEND_URL=http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Frontend Configuration (frontend/.env.local):" -ForegroundColor Yellow
Write-Host "   - Set API URL:"
Write-Host "     NEXT_PUBLIC_API_URL=http://localhost:8000" -ForegroundColor Gray
Write-Host ""

# Step 6: Telegram Bot Setup (Optional)
Write-Status "Telegram Bot Setup (Optional):"
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To enable Telegram 2FA:"
Write-Host "1. Message @BotFather on Telegram"
Write-Host "2. Create a new bot with /newbot"
Write-Host "3. Save the bot token"
Write-Host "4. Add token to backend/.env file"
Write-Host "5. Set webhook URL for production use"
Write-Host ""

# Step 7: Testing Instructions
Write-Status "Testing Instructions:"
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the backend server:"
Write-Host "   cd backend && php artisan serve" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the frontend server:"
Write-Host "   cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Navigate to http://localhost:3000"
Write-Host ""
Write-Host "4. Test 2FA functionality:"
Write-Host "   - Register a new user"
Write-Host "   - Go to Profile → Two-Factor Authentication"
Write-Host "   - Enable any 2FA method"
Write-Host "   - Test login with 2FA"
Write-Host ""

# Step 8: Security Checklist
Write-Status "Security Checklist:"
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before going to production:"
Write-Host "✓ Use HTTPS for all communication" -ForegroundColor Green
Write-Host "✓ Set strong SMTP credentials" -ForegroundColor Green
Write-Host "✓ Use secure Telegram bot tokens" -ForegroundColor Green
Write-Host "✓ Enable rate limiting" -ForegroundColor Green
Write-Host "✓ Monitor authentication logs" -ForegroundColor Green
Write-Host "✓ Regular security updates" -ForegroundColor Green
Write-Host ""

Write-Success "2FA setup script completed!"
Write-Host ""
Write-Status "Next steps:"
Write-Host "1. Configure your .env files"
Write-Host "2. Start the servers"
Write-Host "3. Test the 2FA functionality"
Write-Host "4. Review the documentation in docs/2FA_SETUP.md"
Write-Host ""
Write-Warning "Remember to test all 2FA methods before deploying to production!"
Write-Host ""
