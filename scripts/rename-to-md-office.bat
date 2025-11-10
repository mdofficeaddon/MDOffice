@echo off
echo ========================================
echo   MD Office - Renaming Script
echo ========================================
echo.
echo This script will rename the extension to "MD Office"
echo consistently throughout the project.
echo.
pause

echo.
echo Running PowerShell renaming script...
echo.

PowerShell -ExecutionPolicy Bypass -File "%~dp0rename-to-md-office.ps1"

echo.
echo Done!
pause

