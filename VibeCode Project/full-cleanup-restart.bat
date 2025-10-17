@echo off
REM Full Environment Cleanup and Restart Script for Docker-based AI Tools Platform
REM Windows Batch wrapper for the PowerShell script

echo Starting Full Environment Cleanup and Restart Process...
echo.

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: PowerShell is not available or not working properly.
    echo Please ensure PowerShell is installed and accessible.
    pause
    exit /b 1
)

REM Run the PowerShell script with all arguments passed through
powershell -ExecutionPolicy Bypass -File "%~dp0full-cleanup-restart.ps1" %*

REM Pause to show results
pause


