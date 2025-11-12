@echo off
echo ========================================
echo Open VSX Cleanup and Publishing Script
echo ========================================
echo.
echo This script will help you:
echo 1. Create the MDOffice namespace
echo 2. Publish your extension
echo 3. Guide you to remove old namespaces
echo.

REM Check if OVSX_PAT is set
if "%OVSX_PAT%"=="" (
    echo ERROR: OVSX_PAT environment variable is not set!
    echo.
    echo Please set your Open VSX Personal Access Token first:
    echo   set OVSX_PAT=your_token_here
    echo.
    set /p CONTINUE="Would you like to enter it now? (Y/N): "
    if /i "%CONTINUE%"=="Y" (
        set /p OVSX_PAT="Enter your Open VSX PAT: "
    ) else (
        echo.
        echo Exiting. Please set OVSX_PAT and run again.
        pause
        exit /b 1
    )
)

echo ========================================
echo Step 1: Creating MDOffice namespace
echo ========================================
echo.
ovsx create-namespace MDOffice

if errorlevel 1 (
    echo.
    echo Note: If namespace already exists, this is fine. Continuing...
    echo.
) else (
    echo.
    echo [SUCCESS] MDOffice namespace created!
    echo.
)

echo ========================================
echo Step 2: Publishing extension
echo ========================================
echo.
echo Publishing: dist\md-office-editor-0.2.2.vsix
echo Publisher: MDOffice
echo.

ovsx publish dist\md-office-editor-0.2.2.vsix

if errorlevel 1 (
    echo.
    echo ERROR: Publishing failed!
    echo.
    echo Common issues:
    echo - Check that OVSX_PAT is correct
    echo - Verify the .vsix file exists
    echo - Ensure version is incremented
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Extension published!
echo.
echo Your extension is now available at:
echo https://open-vsx.org/extension/MDOffice/md-office-editor
echo.

echo ========================================
echo Step 3: Cleanup Old Extensions
echo ========================================
echo.
echo To remove old extensions/namespaces, you need to use the web interface:
echo.
echo 1. Go to: https://open-vsx.org/
echo 2. Sign in to your account
echo 3. Check these URLs for old extensions:
echo.
echo    - https://open-vsx.org/extension/06401f15-a30d-6a97-82a3-8ca0e379c4eb/md-office-editor
echo    - https://open-vsx.org/extension/mdofficeaddon/md-office-editor
echo.
echo 4. If they exist, go to extension settings and:
echo    - Click "Delete" or "Unpublish"
echo    - Or contact support if you don't have permissions
echo.
echo Note: The ovsx CLI does not support deletion commands.
echo       You must use the web interface.
echo.

echo ========================================
echo All done!
echo ========================================
echo.
pause


