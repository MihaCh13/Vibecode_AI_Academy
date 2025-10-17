#!/bin/bash

# Full Environment Cleanup and Restart Script for Docker-based AI Tools Platform
# This script performs a complete clean rebuild of the entire environment

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Output functions
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Parse command line arguments
SKIP_CONFIRMATION=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-confirmation)
            SKIP_CONFIRMATION=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--skip-confirmation] [--verbose]"
            echo "  --skip-confirmation  Skip the confirmation prompt"
            echo "  --verbose           Show verbose output including logs"
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            exit 1
            ;;
    esac
done

# Function to check if Docker is running
check_docker_running() {
    if docker info >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start Docker Desktop (macOS)
start_docker_desktop() {
    print_info "Starting Docker Desktop..."
    
    # Try to start Docker Desktop on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open -a Docker
        print_info "Docker Desktop start command sent. Waiting for it to initialize..."
        
        # Wait up to 2 minutes for Docker to start
        local timeout=120
        local elapsed=0
        while [ $elapsed -lt $timeout ]; do
            if check_docker_running; then
                print_success "Docker Desktop is now running!"
                return 0
            fi
            sleep 5
            elapsed=$((elapsed + 5))
            print_info "Waiting for Docker Desktop... ($elapsed/$timeout seconds)"
        done
        
        print_error "Docker Desktop failed to start within $timeout seconds"
        return 1
    else
        print_error "Docker Desktop auto-start not supported on this platform. Please start Docker manually."
        return 1
    fi
}

# Function to kill processes on specific ports
kill_processes_on_ports() {
    local ports=("$@")
    print_info "Checking for processes using ports: ${ports[*]}"
    
    for port in "${ports[@]}"; do
        local pids=$(lsof -ti:$port 2>/dev/null || true)
        if [ -n "$pids" ]; then
            print_info "Killing processes on port $port (PIDs: $pids)"
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi
    done
}

# Function to clean local directories
clean_local_caches() {
    print_info "Cleaning local caches and build directories..."
    
    local cache_dirs=(
        ".next"
        "node_modules"
        ".cache"
        "dist"
        "build"
        "frontend/.next"
        "frontend/node_modules"
        "frontend/.cache"
        "backend/vendor"
        "backend/storage/framework/cache"
        "backend/storage/framework/sessions"
        "backend/storage/framework/views"
        "backend/bootstrap/cache"
    )
    
    for dir in "${cache_dirs[@]}"; do
        if [ -d "$dir" ]; then
            print_info "Removing $dir..."
            rm -rf "$dir" 2>/dev/null || print_warning "Could not remove $dir"
            print_success "Removed $dir"
        fi
    done
}

# Function to wait for Docker to be ready
wait_for_docker() {
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if check_docker_running; then
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    
    return 1
}

# Main execution
print_info "🚀 Starting Full Environment Cleanup and Restart Process"
print_info "=================================================="

# Confirmation prompt
if [ "$SKIP_CONFIRMATION" = false ]; then
    print_warning "This will perform a COMPLETE cleanup of your Docker environment and local caches."
    print_warning "All containers, images, volumes, and local build artifacts will be removed."
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Operation cancelled by user."
        exit 0
    fi
fi

# Step 1: Check if Docker is running
print_info "Step 1: Checking Docker status..."
if ! check_docker_running; then
    print_warning "Docker is not running. Attempting to start it..."
    if ! start_docker_desktop; then
        print_error "Cannot proceed without Docker. Please start it manually and run this script again."
        exit 1
    fi
else
    print_success "Docker is running"
fi

# Wait for Docker to be fully ready
print_info "Ensuring Docker is fully ready..."
if ! wait_for_docker; then
    print_error "Docker is not responding properly"
    exit 1
fi

# Step 2: Stop and remove all containers
print_info "Step 2: Stopping and removing all containers..."
if [ -n "$(docker ps -aq 2>/dev/null)" ]; then
    print_info "Stopping containers..."
    docker stop $(docker ps -aq) 2>/dev/null || true
    print_info "Removing containers..."
    docker rm -f $(docker ps -aq) 2>/dev/null || true
    print_success "All containers stopped and removed"
else
    print_info "No containers found"
fi

# Step 3: Clean all Docker resources
print_info "Step 3: Cleaning all Docker resources..."
print_info "Pruning images..."
docker image prune -a -f 2>/dev/null || true

print_info "Pruning volumes..."
docker volume prune -f 2>/dev/null || true

print_info "Pruning networks..."
docker network prune -f 2>/dev/null || true

print_info "Pruning builder cache..."
docker builder prune -a -f 2>/dev/null || true

print_info "Performing system prune..."
docker system prune -a -f --volumes 2>/dev/null || true

print_success "Docker resources cleaned"

# Step 4: Clean local environment
print_info "Step 4: Cleaning local environment..."
clean_local_caches

# Step 5: Free used ports
print_info "Step 5: Freeing used ports..."
ports=(3000 8000 3306 6379 8080 8200 8201)
kill_processes_on_ports "${ports[@]}"

# Step 6: Verify system state
print_info "Step 6: Verifying system state..."
remaining_containers=$(docker ps -aq 2>/dev/null || true)
remaining_images=$(docker images -q 2>/dev/null || true)
remaining_volumes=$(docker volume ls -q 2>/dev/null || true)

if [ -n "$remaining_containers" ] || [ -n "$remaining_images" ] || [ -n "$remaining_volumes" ]; then
    print_warning "Some Docker resources still remain. Attempting additional cleanup..."
    docker system prune -a -f --volumes 2>/dev/null || true
else
    print_success "System is clean"
fi

# Test Docker responsiveness
if check_docker_running; then
    print_success "Docker is responsive"
else
    print_error "Docker is not responding properly"
    exit 1
fi

# Step 7: Rebuild from scratch
print_info "Step 7: Rebuilding from scratch..."

# Install frontend dependencies
print_info "Installing frontend dependencies..."
if [ -f "frontend/package.json" ]; then
    cd frontend
    npm install
    print_success "Frontend dependencies installed"
    cd ..
else
    print_warning "No package.json found in frontend directory"
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
if [ -f "backend/composer.json" ]; then
    cd backend
    composer install --no-dev --optimize-autoloader
    print_success "Backend dependencies installed"
    cd ..
else
    print_warning "No composer.json found in backend directory"
fi

# Build and start Docker containers
print_info "Building Docker images (no cache)..."
if ! docker compose build --no-cache; then
    print_error "Failed to build Docker images"
    exit 1
fi
print_success "Docker images built successfully"

print_info "Starting Docker containers..."
if ! docker compose up -d; then
    print_error "Failed to start Docker containers"
    exit 1
fi
print_success "Docker containers started"

# Step 8: Final verification
print_info "Step 8: Final verification..."

# Wait for services to be ready
print_info "Waiting for services to start..."
sleep 10

# Check container status
print_info "Checking container status..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check if all expected containers are running
expected_containers=("laravel-app" "laravel-nginx" "laravel-mysql" "nextjs-app" "laravel-redis")
running_containers=$(docker ps --format "{{.Names}}")

all_running=true
for container in "${expected_containers[@]}"; do
    if echo "$running_containers" | grep -q "^$container$"; then
        print_success "Container $container is running"
    else
        print_warning "Container $container is not running"
        all_running=false
    fi
done

if [ "$all_running" = true ]; then
    print_success "All containers are running successfully!"
else
    print_warning "Some containers are not running. Check the logs with: docker compose logs"
fi

# Display service URLs
print_info "Service URLs:"
print_info "Frontend (Next.js): http://localhost:3000"
print_info "Backend API (Laravel): http://localhost:8000"
print_info "Database (MySQL): localhost:3306"
print_info "Redis: localhost:6379"

print_info "=================================================="
print_success "🎉 Full environment cleanup and restart completed!"
print_info "Your Docker-based AI Tools Platform is now ready for development."

# Optional: Show logs
if [ "$VERBOSE" = true ]; then
    print_info "Showing recent logs..."
    docker compose logs --tail=20
fi


