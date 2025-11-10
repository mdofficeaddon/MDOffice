@echo off
REM Generate tab icons from SVG for VS Code custom editor
REM This batch file wraps the PowerShell script

setlocal enabledelayedexpansion

REM Check if we're in the right directory
if not exist "icon-small-no-bg.svg" (
    echo Error: icon-small-no-bg.svg not found
    echo Please run this script from the project root directory
    exit /b 1
)

REM Run the PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0generate-tab-icons.ps1" %*
exit /b !errorlevel!

