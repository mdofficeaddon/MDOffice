@echo off
echo Starting MDOffice - Markdown Office Editor in Development Mode...
echo.

echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting TypeScript compiler in watch mode...
echo Press Ctrl+C to stop
echo.
call npm run watch


