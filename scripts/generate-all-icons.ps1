# Generate all icons (tab icons + marketplace icon)
# PowerShell version for cross-shell compatibility

# Change to project root (parent of scripts directory)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

Write-Host "Generating all icons..."
Write-Host ""

# Generate tab icons
Write-Host "Generating tab icons..."
python scripts/generate_tab_icons.py
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error: Failed to generate tab icons"
    exit 1
}

# Generate marketplace icon
Write-Host "Generating marketplace icon..."
python scripts/generate_marketplace_icon.py
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error: Failed to generate marketplace icon"
    exit 1
}

Write-Host ""
Write-Host "[SUCCESS] All icons generated successfully!"
exit 0

