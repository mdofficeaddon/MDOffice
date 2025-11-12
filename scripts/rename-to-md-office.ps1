# Rename Extension to MD Office
# This script renames the extension consistently throughout the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MD Office - Renaming Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define the new names
$newPackageName = "md-office"
$newDisplayName = "MD Office"
$newDescription = "Transform VS Code into a powerful markdown editor with Office-like interface, WYSIWYG preview editing, rich formatting toolbar, find & replace, and PDF/HTML export"

Write-Host "This script will rename the extension to:" -ForegroundColor Yellow
Write-Host "  Package Name: $newPackageName" -ForegroundColor White
Write-Host "  Display Name: $newDisplayName" -ForegroundColor White
Write-Host ""

# Confirm with user
$confirmation = Read-Host "Do you want to proceed? (y/n)"
if ($confirmation -ne 'y') 
{
    Write-Host "Operation cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Starting renaming process..." -ForegroundColor Green
Write-Host ""

# 1. Update package.json
Write-Host "[1/5] Updating package.json..." -ForegroundColor Cyan
$packagePath = "package.json"
if (Test-Path $packagePath) 
{
    $content = Get-Content $packagePath -Raw
    $content = $content -replace '"name":\s*"[^"]*"', "`"name`": `"$newPackageName`""
    $content = $content -replace '"displayName":\s*"[^"]*"', "`"displayName`": `"$newDisplayName`""
    Set-Content $packagePath $content -NoNewline
    Write-Host "  ✓ package.json updated" -ForegroundColor Green
} 
else 
{
    Write-Host "  ✗ package.json not found!" -ForegroundColor Red
}

# 2. Update README.md title
Write-Host "[2/5] Updating README.md..." -ForegroundColor Cyan
$readmePath = "README.md"
if (Test-Path $readmePath) 
{
    $content = Get-Content $readmePath -Raw
    # Update main title
    $content = $content -replace "^#\s+.*Office.*", "# $newDisplayName"
    # Update first paragraph mentions
    $content = $content -replace "Transform your VS Code or Cursor into a powerful \*\*Office-like markdown editor\*\*!", "Transform your VS Code or Cursor into a powerful **Office-like markdown editor** with **$newDisplayName**!"
    Set-Content $readmePath $content -NoNewline
    Write-Host "  ✓ README.md updated" -ForegroundColor Green
} 
else 
{
    Write-Host "  ✗ README.md not found!" -ForegroundColor Red
}

# 3. Update CHANGELOG.md
Write-Host "[3/5] Updating CHANGELOG.md..." -ForegroundColor Cyan
$changelogPath = "CHANGELOG.md"
if (Test-Path $changelogPath) 
{
    $content = Get-Content $changelogPath -Raw
    # Update title
    $content = $content -replace "^#\s+.*Office.*", "# $newDisplayName - Changelog"
    Set-Content $changelogPath $content -NoNewline
    Write-Host "  ✓ CHANGELOG.md updated" -ForegroundColor Green
} 
else 
{
    Write-Host "  ✗ CHANGELOG.md not found!" -ForegroundColor Red
}

# 4. Update CONTRIBUTING.md
Write-Host "[4/5] Updating CONTRIBUTING.md..." -ForegroundColor Cyan
$contributingPath = "CONTRIBUTING.md"
if (Test-Path $contributingPath) 
{
    $content = Get-Content $contributingPath -Raw
    $content = $content -replace "^#\s+Contributing to.*", "# Contributing to $newDisplayName"
    $content = $content -replace "MDOffice - Markdown Office Editor", "$newDisplayName"
    Set-Content $contributingPath $content -NoNewline
    Write-Host "  ✓ CONTRIBUTING.md updated" -ForegroundColor Green
} 
else 
{
    Write-Host "  ✗ CONTRIBUTING.md not found!" -ForegroundColor Red
}

# 5. Update documentation files in docs/
Write-Host "[5/5] Updating documentation files..." -ForegroundColor Cyan
$docsUpdated = 0
if (Test-Path "docs") 
{
    Get-ChildItem -Path "docs" -Filter "*.md" -Recurse | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $updated = $content -replace "MDOffice - Markdown Office Editor", "$newDisplayName"
        if ($content -ne $updated) 
        {
            Set-Content $_.FullName $updated -NoNewline
            $docsUpdated++
        }
    }
    Write-Host "  ✓ Updated $docsUpdated documentation files" -ForegroundColor Green
} 
else 
{
    Write-Host "  ✗ docs folder not found!" -ForegroundColor Red
}

# 6. Check for old .vsix files
Write-Host ""
Write-Host "Checking for old .vsix files..." -ForegroundColor Cyan
$vsixFiles = Get-ChildItem -Path "." -Filter "*.vsix"
if ($vsixFiles) 
{
    foreach ($file in $vsixFiles) 
    {
        Write-Host "  Found old package: $($file.Name)" -ForegroundColor Yellow
        $deleteOld = Read-Host "  Do you want to delete it? (y/n)"
        if ($deleteOld -eq 'y') 
        {
            Remove-Item $file.FullName -Force
            Write-Host "  ✓ Deleted $($file.Name)" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Renaming Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  • Package name: $newPackageName" -ForegroundColor White
Write-Host "  • Display name: $newDisplayName" -ForegroundColor White
Write-Host "  • Files updated: 5+ core files + $docsUpdated docs" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review the changes in your files" -ForegroundColor White
Write-Host "  2. Run: npm run compile" -ForegroundColor White
Write-Host "  3. Run: npm run package" -ForegroundColor White
Write-Host "  4. New package will be: $newPackageName-0.2.0.vsix" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
