@echo off
echo Installing Markdown Office Editor Extension...
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Compiling TypeScript...
call npm run compile
if errorlevel 1 (
    echo Error: Failed to compile TypeScript
    pause
    exit /b 1
)

echo.
echo Step 3: Creating VSIX package...
call npm run package
if errorlevel 1 (
    echo Error: Failed to create VSIX package
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation complete!
echo.
echo To install the extension:
echo 1. Open VS Code or Cursor
echo 2. Press Ctrl+Shift+X to open Extensions
echo 3. Click the '...' menu and select 'Install from VSIX...'
echo 4. Select the .vsix file created in this directory
echo ========================================
echo.
pause


