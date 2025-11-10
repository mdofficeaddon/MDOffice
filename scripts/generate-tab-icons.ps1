# Generate tab icons from SVG for VS Code custom editor
# This script converts icon-small-no-bg.svg to PNG files in various sizes

param(
    [switch]$Help
)

if ($Help) {
    Write-Host @"
Usage: .\generate-tab-icons.ps1

Description:
    Generates PNG icon files from icon-small-no-bg.svg for VS Code custom editor tabs.
    Creates:
    - icon-tab-16.png (16x16 - for file explorer/tabs)
    - icon-tab-24.png (24x24 - high resolution tabs)
    - icon-tab-32.png (32x32 - for high DPI displays)

Prerequisites:
    - ImageMagick must be installed (convert command available)
    - SVG file: icon-small-no-bg.svg (in project root)

Installation:
    Windows: choco install imagemagick
    Or download from: https://imagemagick.org/script/download.php#windows
"@
    exit 0
}

# Check if we're in the project root
if (-not (Test-Path "icon-small-no-bg.svg")) {
    Write-Error "Error: icon-small-no-bg.svg not found in current directory"
    Write-Host "Please run this script from the project root directory"
    exit 1
}

# Check if ImageMagick is installed
try {
    $convert = Get-Command convert -ErrorAction Stop
    Write-Host "[OK] ImageMagick found: $($convert.Source)"
}
catch {
    Write-Error "ImageMagick (convert command) not found"
    Write-Host "Please install ImageMagick from: https://imagemagick.org/script/download.php#windows"
    Write-Host "Or use: choco install imagemagick"
    exit 1
}

# Create media directory if it doesn't exist
if (-not (Test-Path "media")) {
    New-Item -ItemType Directory -Path "media" | Out-Null
    Write-Host "[OK] Created media/ directory"
}

# Generate icon files
$sizes = @(16, 24, 32)
$errors = $false

foreach ($size in $sizes) {
    $outputFile = "media/icon-tab-$size.png"
    
    try {
        Write-Host "Generating $outputFile (${size}x${size})..."
        & convert -background none -size "${size}x${size}" icon-small-no-bg.svg $outputFile
        
        if (Test-Path $outputFile) {
            $fileSize = (Get-Item $outputFile).Length
            $fileSizeKB = [Math]::Round($fileSize/1024, 2)
            Write-Host "  [OK] Created: $outputFile ($fileSizeKB KB)"
        }
        else {
            Write-Error "  [FAIL] Failed to create $outputFile"
            $errors = $true
        }
    }
    catch {
        Write-Error "  [FAIL] Error generating $outputFile : $_"
        $errors = $true
    }
}

if ($errors) {
    Write-Host ""
    Write-Error "Some icons failed to generate"
    exit 1
}
else {
    Write-Host ""
    Write-Host "[SUCCESS] All tab icons generated successfully!"
    Write-Host "Next: Update package.json to use these icons (already done)"
    exit 0
}
