@echo off
REM Generate tab icons from SVG for VS Code custom editor
REM This batch file runs the Python script

setlocal enabledelayedexpansion

REM Change to project root
cd /d "%~dp0.."

REM Run the Python script
python scripts/generate_tab_icons.py

if errorlevel 1 (
    echo.
    echo Error: Failed to generate icons
    echo Make sure Python is installed and accessible
    pause
    exit /b 1
)

pause
exit /b 0

