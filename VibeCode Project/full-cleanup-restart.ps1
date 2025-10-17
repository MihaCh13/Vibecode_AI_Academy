# Full Environment Cleanup and Restart Script for Docker-based AI Tools Platform
# This script performs a complete clean rebuild of the entire environment

param(
    [switch]$SkipConfirmation,
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Continue"

# Color functions for better output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success($message) { Write-ColorOutput Green "Success: $message" }
function Write-Info($message) { Write-ColorOutput Cyan "Info: $message" }
function Write-Warning($message) { Write-ColorOutput Yellow "Warning: $message" }
function Write-Error($message) { Write-ColorOutput Red "Error: $message" }

# Function to check if Docker Desktop is running
function Test-DockerRunning {
    try {
        $null = docker info 2>$null
        return $true
    } catch {
        return $false
    }
}

# Function to start Docker Desktop (Windows)
function Start-DockerDesktop {
    Write-Info "Starting Docker Desktop..."
    
    # Try to start Docker Desktop
    try {
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -ErrorAction SilentlyContinue
        Write-Info "Docker Desktop start command sent. Waiting for it to initialize..."
        
        # Wait up to 2 minutes for Docker to start
        $timeout = 120
        $elapsed = 0
        while ($elapsed -lt $timeout) {
            if (Test-DockerRunning) {
                Write-Success "Docker Desktop is now running!"
                return $true
            }
            Start-Sleep -Seconds 5
            $elapsed += 5
            Write-Info "Waiting for Docker Desktop... ($elapsed/$timeout seconds)"
        }
        
        Write-Error "Docker Desktop failed to start within $timeout seconds"
        return $false
    } catch {
        Write-Error "Failed to start Docker Desktop: $($_.Exception.Message)"
        return $false
    }
}

# Function to kill processes on specific ports
function Stop-ProcessesOnPorts {
    param([int[]]$Ports)
    
    Write-Info "Checking for processes using ports: $($Ports -join ', ')"
    
    foreach ($port in $Ports) {
        try {
            $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
                        Select-Object -ExpandProperty OwningProcess -Unique
            
            if ($processes) {
                foreach ($pid in $processes) {
                    try {
                        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                        if ($process) {
                            Write-Info "Killing process $($process.ProcessName) (PID: $pid) on port $port"
                            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                        }
                    } catch {
                        # Process might have already terminated
                    }
                }
            }
        } catch {
            # Port might not be in use
        }
    }
}

# Function to clean local directories
function Remove-LocalCaches {
    Write-Info "Cleaning local caches and build directories..."
    
    $cacheDirs = @(
        ".next",
        "node_modules",
        ".cache",
        "dist",
        "build",
        "frontend/.next",
        "frontend/node_modules",
        "frontend/.cache",
        "backend/vendor",
        "backend/storage/framework/cache",
        "backend/storage/framework/sessions",
        "backend/storage/framework/views",
        "backend/bootstrap/cache"
    )
    
    foreach ($dir in $cacheDirs) {
        if (Test-Path $dir) {
            try {
                Write-Info "Removing $dir..."
                Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
                Write-Success "Removed $dir"
            } catch {
                Write-Warning "Could not remove $dir`: $($_.Exception.Message)"
            }
        }
    }
}

# Main execution
Write-Info "Starting Full Environment Cleanup and Restart Process"
Write-Info "=================================================="

# Confirmation prompt
if (-not $SkipConfirmation) {
    Write-Warning "This will perform a COMPLETE cleanup of your Docker environment and local caches."
    Write-Warning "All containers, images, volumes, and local build artifacts will be removed."
    $confirmation = Read-Host "Are you sure you want to continue? (y/N)"
    if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
        Write-Info "Operation cancelled by user."
        exit 0
    }
}

# Step 1: Check if Docker Desktop is running
Write-Info "Step 1: Checking Docker Desktop status..."
if (-not (Test-DockerRunning)) {
    Write-Warning "Docker Desktop is not running. Attempting to start it..."
    if (-not (Start-DockerDesktop)) {
        Write-Error "Cannot proceed without Docker Desktop. Please start it manually and run this script again."
        exit 1
    }
} else {
    Write-Success "Docker Desktop is running"
}

# Step 2: Stop and remove all containers
Write-Info "Step 2: Stopping and removing all containers..."
try {
    $containers = docker ps -aq 2>$null
    if ($containers) {
        Write-Info "Stopping containers..."
        docker stop $containers 2>$null | Out-Null
        Write-Info "Removing containers..."
        docker rm -f $containers 2>$null | Out-Null
        Write-Success "All containers stopped and removed"
    } else {
        Write-Info "No containers found"
    }
} catch {
    Write-Warning "Error managing containers: $($_.Exception.Message)"
}

# Step 3: Clean all Docker resources
Write-Info "Step 3: Cleaning all Docker resources..."
try {
    Write-Info "Pruning images..."
    docker image prune -a -f 2>$null | Out-Null
    
    Write-Info "Pruning volumes..."
    docker volume prune -f 2>$null | Out-Null
    
    Write-Info "Pruning networks..."
    docker network prune -f 2>$null | Out-Null
    
    Write-Info "Pruning builder cache..."
    docker builder prune -a -f 2>$null | Out-Null
    
    Write-Info "Performing system prune..."
    docker system prune -a -f --volumes 2>$null | Out-Null
    
    Write-Success "Docker resources cleaned"
} catch {
    Write-Warning "Error cleaning Docker resources: $($_.Exception.Message)"
}

# Step 4: Clean local environment
Write-Info "Step 4: Cleaning local environment..."
Remove-LocalCaches

# Step 5: Free used ports
Write-Info "Step 5: Freeing used ports..."
$ports = @(3000, 8000, 3306, 6379, 8080, 8200, 8201)
Stop-ProcessesOnPorts -Ports $ports

# Step 6: Verify system state
Write-Info "Step 6: Verifying system state..."
try {
    $remainingContainers = docker ps -aq 2>$null
    $remainingImages = docker images -q 2>$null
    $remainingVolumes = docker volume ls -q 2>$null
    
    if ($remainingContainers -or $remainingImages -or $remainingVolumes) {
        Write-Warning "Some Docker resources still remain. Attempting additional cleanup..."
        docker system prune -a -f --volumes 2>$null | Out-Null
    } else {
        Write-Success "System is clean"
    }
    
    # Test Docker responsiveness
    if (Test-DockerRunning) {
        Write-Success "Docker is responsive"
    } else {
        Write-Error "Docker is not responding properly"
        exit 1
    }
} catch {
    Write-Error "Error verifying system state: $($_.Exception.Message)"
    exit 1
}

# Step 7: Rebuild from scratch
Write-Info "Step 7: Rebuilding from scratch..."

# Install frontend dependencies
Write-Info "Installing frontend dependencies..."
Set-Location frontend
try {
    if (Test-Path "package.json") {
        npm install
        Write-Success "Frontend dependencies installed"
    } else {
        Write-Warning "No package.json found in frontend directory"
    }
} catch {
    Write-Warning "Error installing frontend dependencies: $($_.Exception.Message)"
}
Set-Location ..

# Install backend dependencies
Write-Info "Installing backend dependencies..."
Set-Location backend
try {
    if (Test-Path "composer.json") {
        composer install --no-dev --optimize-autoloader
        Write-Success "Backend dependencies installed"
    } else {
        Write-Warning "No composer.json found in backend directory"
    }
} catch {
    Write-Warning "Error installing backend dependencies: $($_.Exception.Message)"
}
Set-Location ..

# Build and start Docker containers
Write-Info "Building Docker images (no cache)..."
try {
    docker compose build --no-cache
    Write-Success "Docker images built successfully"
} catch {
    Write-Error "Failed to build Docker images: $($_.Exception.Message)"
    exit 1
}

Write-Info "Starting Docker containers..."
try {
    docker compose up -d
    Write-Success "Docker containers started"
} catch {
    Write-Error "Failed to start Docker containers: $($_.Exception.Message)"
    exit 1
}

# Step 8: Final verification
Write-Info "Step 8: Final verification..."

# Wait for services to be ready
Write-Info "Waiting for services to start..."
Start-Sleep -Seconds 10

# Check container status
Write-Info "Checking container status..."
try {
    $containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Info "Container Status:"
    Write-Output $containers
    
    # Check if all expected containers are running
    $expectedContainers = @("laravel-app", "laravel-nginx", "laravel-mysql", "nextjs-app", "laravel-redis")
    $runningContainers = docker ps --format "{{.Names}}"
    
    $allRunning = $true
    foreach ($container in $expectedContainers) {
        if ($runningContainers -notcontains $container) {
            Write-Warning "Container $container is not running"
            $allRunning = $false
        } else {
            Write-Success "Container $container is running"
        }
    }
    
    if ($allRunning) {
        Write-Success "All containers are running successfully!"
    } else {
        Write-Warning "Some containers are not running. Check the logs with: docker compose logs"
    }
} catch {
    Write-Error "Error checking container status: $($_.Exception.Message)"
}

# Display service URLs
Write-Info "Service URLs:"
Write-Info "Frontend (Next.js): http://localhost:3000"
Write-Info "Backend API (Laravel): http://localhost:8000"
Write-Info "Database (MySQL): localhost:3306"
Write-Info "Redis: localhost:6379"

Write-Info "=================================================="
Write-Success "Full environment cleanup and restart completed!"
Write-Info "Your Docker-based AI Tools Platform is now ready for development."

# Optional: Show logs
if ($Verbose) {
    Write-Info "Showing recent logs..."
    docker compose logs --tail=20
}