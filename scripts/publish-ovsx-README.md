# Open VSX Publishing Helper Script

This script helps you publish your extension to the Open VSX Registry.

## Prerequisites

1. Install `ovsx` CLI tool:
   ```bash
   npm install -g ovsx
   ```

2. Get your Open VSX Personal Access Token:
   - Go to [open-vsx.org](https://open-vsx.org/)
   - Sign in and go to your account settings
   - Generate a Personal Access Token

3. Set the token as an environment variable:
   ```powershell
   $env:OVSX_PAT="your_personal_access_token_here"
   ```

## Usage

### Windows (Batch Script)
```cmd
.\scripts\publish-ovsx.bat
```

### Manual Publishing
```bash
# 1. Build the package
npm run package

# 2. Set your token (Windows PowerShell)
$env:OVSX_PAT="your_token"

# 3. Publish
ovsx publish dist/md-office-editor-*.vsix

# Or use npm script
npm run publish:ovsx
```

## First-Time Publishing

When publishing for the first time:
1. You'll be prompted to create a namespace
2. The namespace should match your `publisher` field in `package.json` (currently: `MDOffice`)
3. Confirm the namespace creation

## Updating an Extension

1. Increment the version number in `package.json`
2. Rebuild: `npm run package`
3. Publish: `ovsx publish dist/md-office-editor-*.vsix`

## Troubleshooting

- **"OVSX_PAT not set"**: Set the environment variable before running
- **"Version already exists"**: Increment version in `package.json`
- **"Namespace not found"**: Create the namespace on Open VSX first
- **"Invalid token"**: Verify your token is correct and has publish permissions

For more details, see [PUBLISHING.md](../docs/PUBLISHING.md)

