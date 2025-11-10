@echo off
echo ============================================
echo Markdown Office Editor - Requirements Check
echo ============================================
echo.

echo Checking Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [ERROR] Node.js is NOT installed
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo.
    goto :missing
)

echo.
echo Checking npm...
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] npm is installed
    npm --version
) else (
    echo [ERROR] npm is NOT installed
    echo.
    echo npm should come with Node.js.
    echo Please reinstall Node.js from: https://nodejs.org/
    echo.
    goto :missing
)

echo.
echo Checking VS Code or Cursor...
where code >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] VS Code/Cursor is installed
) else (
    echo [WARNING] 'code' command not found
    echo Make sure VS Code or Cursor is installed
)

echo.
echo ============================================
echo All requirements are met! You can proceed.
echo ============================================
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run compile
echo 3. Press F5 in VS Code/Cursor
echo.
pause
exit /b 0

:missing
echo.
echo ============================================
echo Please install missing requirements first!
echo ============================================
echo.
pause
exit /b 1


