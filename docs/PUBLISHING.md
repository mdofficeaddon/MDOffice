# Publishing Guide

This guide explains how to publish and update your extension on both the VS Code Marketplace and Open VSX Registry.

## Prerequisites

1. **VS Code Marketplace** (for VS Code/Cursor):
   - Install `vsce` (VS Code Extension Manager):

```bash
npm install -g @vscode/vsce
```

   - Create a publisher account at [marketplace.visualstudio.com](https://marketplace.visualstudio.com/manage)
   - Create a Personal Access Token (PAT) with marketplace publish permissions

2. **Open VSX Registry** (for VSCodium and other open-source editors):
   - Install `ovsx` CLI tool:

```bash
npm install -g ovsx
```

   - Create an account at [open-vsx.org](https://open-vsx.org/)
   - Generate a Personal Access Token from your account settings

## Publishing Steps

### 1. Prepare Your Extension

Before publishing, ensure:

- ✅ All code is compiled (`npm run compile`)

- ✅ Version number is updated in `package.json`

- ✅ `publisher` field is set correctly in `package.json` (currently: `MDOffice`)

- ✅ Extension is tested locally

- ✅ CHANGELOG.md is updated with new version notes

### 2. Build the Extension Package

Create a `.vsix` package:

```
bash
npm run package

```

This will:

- Compile TypeScript

- Generate icons (if needed)

- Create a `.vsix` file in the `dist/` directory

### 3. Publish to VS Code Marketplace

**First-time publishing:**

```
bash
vsce publish

```

You'll be prompted for:

- Your Personal Access Token (PAT)

- Publisher name (should match `package.json`)

**Updating an existing extension:**

```
bash
vsce publish

```

The version number in `package.json` must be incremented for updates.

**Publishing a specific VSIX file:**

```
bash
vsce publish --packagePath dist/md-office-editor-0.2.2.vsix

```

### 4. Publish to Open VSX Registry

**Set your Open VSX Personal Access Token:**
**Windows (PowerShell):**

```
powershell
$env:OVSX*PAT="your*personal*access*token*here"
*
```

*
**Windows (Command Prompt):**
*
```
*`cmd
set OVSX`*PAT=your*personal*access*token*here

```

**Linux/Mac:**

```
bash
export OVSX*PAT=your*personal*access*token*here
*
```

*
**First-time publishing:**

```
bash
ovsx publish dist/md-office-editor-0.2.2.vsix

```

You'll be prompted to:

- Create a namespace (publisher name) if it doesn't exist

- Confirm the namespace matches your `package.json` publisher

**Updating an existing extension:**

```
bash
ovsx publish dist/md-office-editor-0.2.2.vsix

```

The version number must be incremented for updates.

**Using npm script:**

```
bash
npm run publish:ovsx

```

This script will automatically use the latest `.vsix` file from the `dist/` directory.

## Important Notes

### Version Numbering

- Follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- Examples: `1.0.0`, `1.0.1`, `1.1.0`, `2.0.0`

- Always increment the version in `package.json` before publishing

### Publisher Name

- The `publisher` field in `package.json` must match your publisher account name

- Current publisher: `MDOffice` (previously: `06401f15-a30d-6a97-82a3-8ca0e379c4eb` and `mdofficeaddon`)

- This cannot be changed after first publication without creating a new extension

### Extension ID

- Format: `publisher.extension-name`

- Example: `MDOffice.md-office-editor`

- This is automatically generated from `package.json`

### Security Best Practices

1. **Never commit tokens to version control**
  - Use environment variables for tokens

  - Add `.env` files to `.gitignore`

  - Use secure token storage (e.g., GitHub Secrets for CI/CD)

1. **Token Permissions**
  - Only grant necessary permissions

  - Revoke compromised tokens immediately

  - Rotate tokens periodically

1. **Code Review**
  - Review all code before publishing

  - Test extensions thoroughly

  - Check for security vulnerabilities

## Troubleshooting

### "Publisher not found" Error

- Ensure your publisher account exists on the marketplace

- Verify the publisher name in `package.json` matches your account

- For Open VSX, you may need to create a namespace first

### "Version already exists" Error

- Increment the version number in `package.json`

- Rebuild the package: `npm run package`

- Try publishing again

### "Invalid token" Error

- Verify your token is correct

- Check token expiration date

- Ensure token has publish permissions

- Regenerate token if needed

### Extension Not Appearing

- Wait a few minutes for the registry to update

- Clear browser cache

- Check the extension ID matches exactly

- Verify publication was successful (check publisher dashboard)

## Automated Publishing (CI/CD)

### GitHub Actions Example

Create `.github/workflows/publish.yml`:

*
```
*`yaml
name: Publish Extension
on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:

- uses: actions/checkout@v3

      
- name: Setup Node.js

        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
- name: Install dependencies

        run: npm ci
      
- name: Compile extension

        run: npm run compile
      
- name: Package extension

        run: npm run package
      
- name: Publish to VS Code Marketplace

        uses: HaaLeo/publish-vscode-extension@v1
        with:
          pat: ${{ secrets.VSCE`*PAT }}
          packagePath: 'dist/*.vsix'
      
- name: Publish to Open VSX

        uses: HaaLeo/publish-vscode-extension@v1
        with:
          pat: ${{ secrets.OVSX*PAT }}
          registryUrl: 'https://open-vsx.org'
          packagePath: 'dist/*.vsix'
*
```

*
**Required GitHub Secrets:**
*- 
- *`VSCE`*`PAT` - VS Code Marketplace Personal Access Token

- `OVSX*PAT*`* - Open VSX Personal Access Token*
- 

*
## Quick Reference

### Commands Summary

*
```
*`bash
# Build and package

npm run compile          # Compile TypeScript
npm run package          # Create .vsix file
# Publish to VS Code Marketplace

vsce publish             # Publish (interactive)
vsce publish --packagePath dist/extension.vsix  # Publish specific file
# Publish to Open VSX

ovsx publish dist/extension.vsix  # Publish (requires OVSX`*PAT env var)
npm run publish:ovsx     # Using npm script

```

### File Locations

- Compiled code: `out/`

- Package file: `dist/md-office-editor-{version}.vsix`

- Configuration: `package.json`

- Version history: `CHANGELOG.md`

## Additional Resources

- [VS Code Extension Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

- [Open VSX Publishing Guide](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)

- [VS Code Extension API](https://code.visualstudio.com/api)

- [Semantic Versioning](https://semver.org/)

---

**Need Help?** Open an issue on [GitHub](https://github.com/mdofficeaddon/MDOffice/issues)