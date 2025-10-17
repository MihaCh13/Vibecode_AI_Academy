# Installation & Setup Guide

## 📋 Prerequisites

Before setting up the AI Tools Platform, ensure you have the following installed:

### Required Software
- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/)
- **Git**: [Download here](https://git-scm.com/downloads)
- **Node.js** (Optional): Version 18+ for local development
- **Composer** (Optional): For local Laravel development

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Disk Space**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

#### For Windows:
```powershell
# Clone the repository
git clone <repository-url>
cd project

# Run the setup script
.\setup.ps1
```

#### For Linux/macOS:
```bash
# Clone the repository
git clone <repository-url>
cd project

# Make setup script executable and run
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

## 📥 Step 1: Clone Repository

```bash
git clone <repository-url>
cd project
```

## 🔧 Step 2: Configure Environment Variables

### Backend Configuration
```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit the backend environment file
# backend/.env
```

**Required Backend Environment Variables:**
```env
APP_NAME="AI Tools Platform"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel_ai_tools
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password

SESSION_DRIVER=file
CACHE_DRIVER=file

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

### Frontend Configuration
```bash
# Copy the example environment file
cp frontend/.env.example frontend/.env.local

# Edit the frontend environment file
# frontend/.env.local
```

**Required Frontend Environment Variables:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐳 Step 3: Start Docker Services

### Start All Services
```bash
# Build and start all containers
docker-compose up --build -d

# Check container status
docker-compose ps
```

### Expected Output:
```
NAME            IMAGE              STATUS
laravel-app     project-app        Up
laravel-mysql   mysql:8.0          Up  
laravel-nginx   nginx:alpine       Up
laravel-redis   redis:alpine       Up
nextjs-app      project-frontend   Up
```

## 🗄️ Step 4: Database Setup

### Generate Application Key
```bash
# Generate Laravel application key
docker-compose exec app php artisan key:generate
```

### Run Migrations
```bash
# Run database migrations
docker-compose exec app php artisan migrate
```

### Seed Test Data
```bash
# Seed the database with test users
docker-compose exec app php artisan db:seed
```

### Verify Database
```bash
# Check migration status
docker-compose exec app php artisan migrate:status

# Expected output:
# 2014_10_12_000000_create_users_table ............................... [1] Ran
# 2019_12_14_000001_create_personal_access_tokens_table .............. [1] Ran
```

## ✅ Step 5: Verify Installation

### Test Backend API
```bash
# Test if Laravel is running
curl http://localhost:8000/api/roles

# Expected: JSON response with role definitions
```

### Test Frontend
```bash
# Test if Next.js is running
curl http://localhost:3000

# Expected: HTML response
```

### Test Login API
```bash
# Test authentication
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ivan@admin.local","password":"password"}'

# Expected: JSON with token and user data
```

## 🌐 Step 6: Access the Application

### Web Interface
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Login Page**: http://localhost:3000/login

### Test Login
1. Go to http://localhost:3000/login
2. Use any of the test accounts:
   - **Owner**: ivan@admin.local / password
   - **Backend**: petar@backend.local / password
   - **Frontend**: elena@frontend.local / password
   - **PM**: maria@pm.local / password
   - **QA**: nikolay@qa.local / password
   - **Designer**: sofia@designer.local / password

## 🔧 Development Commands

### Laravel Commands
```bash
# Access Laravel container
docker-compose exec app bash

# Run Laravel commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache

# View logs
docker-compose logs app
```

### Next.js Commands
```bash
# Access frontend container
docker-compose exec frontend sh

# Run frontend commands
docker-compose exec frontend npm install
docker-compose exec frontend npm run build
docker-compose exec frontend npm run dev

# View logs
docker-compose logs frontend
```

### Database Commands
```bash
# Access MySQL container
docker-compose exec db mysql -u laravel_user -p laravel_ai_tools

# View database logs
docker-compose logs db
```

## 🔄 Common Operations

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart app
docker-compose restart frontend
```

### Update Dependencies
```bash
# Update Laravel dependencies
docker-compose exec app composer update

# Update Next.js dependencies
docker-compose exec frontend npm update
```

### Clear Caches
```bash
# Clear Laravel caches
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear

# Clear Next.js cache
docker-compose exec frontend rm -rf .next
```

### View Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs frontend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f app
```

## 🛠️ Troubleshooting Setup Issues

### Docker Issues
```bash
# Check Docker status
docker --version
docker-compose --version

# Restart Docker Desktop
# (Windows/macOS: Restart Docker Desktop application)

# Clean up Docker resources
docker system prune -a
```

### Port Conflicts
```bash
# Check if ports are in use
netstat -tulpn | grep :8000
netstat -tulpn | grep :3000

# Change ports in docker-compose.yml if needed
```

### Permission Issues
```bash
# Fix file permissions (Linux/macOS)
sudo chown -R $USER:$USER .
chmod -R 755 .

# Windows: Run PowerShell as Administrator
```

### Database Connection Issues
```bash
# Check database container
docker-compose ps db

# Test database connection
docker-compose exec app php artisan tinker
# Then in tinker: DB::connection()->getPdo();
```

## 📊 Health Checks

### Service Status
```bash
# Check all services are running
docker-compose ps

# Test API endpoints
curl http://localhost:8000/api/roles
curl http://localhost:3000

# Test database connection
docker-compose exec app php artisan migrate:status
```

### Performance Check
```bash
# Check container resource usage
docker stats

# Check disk usage
docker system df
```

## 🔐 Security Considerations

### Production Setup
- Change default passwords in `.env` files
- Use strong database passwords
- Enable HTTPS in production
- Configure proper CORS settings
- Set up SSL certificates

### Environment Security
```env
# Production environment variables
APP_ENV=production
APP_DEBUG=false
DB_PASSWORD=your_strong_password_here
```

## 📚 Next Steps

After successful setup:

1. **Explore the Platform**: Log in with different test accounts
2. **Review Documentation**: Read through the API and frontend documentation
3. **Customize**: Modify configurations for your specific needs
4. **Develop**: Start building additional features
5. **Deploy**: Follow deployment guidelines for production

---

*If you encounter any issues during setup, refer to the troubleshooting guide or check the project's issue tracker.*