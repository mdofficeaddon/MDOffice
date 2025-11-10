@echo off
REM Generate all icons (tab icons + marketplace icon)
REM This script runs both icon generation scripts

setlocal enabledelayedexpansion

REM Change to project root
cd /d "%~dp0.."

echo Generating all icons...
echo.

REM Generate tab icons
python scripts/generate_tab_icons.py
if errorlevel 1 (
    echo Error: Failed to generate tab icons
    exit /b 1
)

REM Generate marketplace icon
python scripts/generate_marketplace_icon.py
if errorlevel 1 (
    echo Error: Failed to generate marketplace icon
    exit /b 1
)

echo.
echo [SUCCESS] All icons generated successfully!
exit /b 0

