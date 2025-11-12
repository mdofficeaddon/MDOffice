@echo off
echo ========================================
echo Open VSX Publishing Helper
echo ========================================
echo.

REM Check if OVSX_PAT is set
if "%OVSX_PAT%"=="" (
    echo ERROR: OVSX_PAT environment variable is not set!
    echo.
    echo Please set your Open VSX Personal Access Token:
    echo   set OVSX_PAT=your_token_here
    echo.
    echo Or run this command:
    echo   set /p OVSX_PAT="Enter your Open VSX PAT: "
    echo.
    pause
    exit /b 1
)

echo Step 1: Checking if extension is packaged...
if not exist "dist\*.vsix" (
    echo No .vsix file found in dist\ directory.
    echo Building package...
    call npm run package
    if errorlevel 1 (
        echo Error: Failed to create package
        pause
        exit /b 1
    )
)

echo.
echo Step 2: Finding latest .vsix file...
for %%f in (dist\*.vsix) do set VSIX_FILE=%%f
echo Found: %VSIX_FILE%

echo.
echo Step 3: Publishing to Open VSX Registry...
echo Publisher: MDOffice
echo.
ovsx publish "%VSIX_FILE%"

if errorlevel 1 (
    echo.
    echo ERROR: Publishing failed!
    echo.
    echo Common issues:
    echo - Check that OVSX_PAT is set correctly
    echo - Verify your token has publish permissions
    echo - Ensure version number is incremented
    echo - Check that namespace exists on Open VSX
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Publishing successful!
echo ========================================
echo.
echo Your extension should be available at:
echo https://open-vsx.org/extension/MDOffice/md-office-editor
echo.
pause

