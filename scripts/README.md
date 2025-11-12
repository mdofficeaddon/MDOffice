# Development Scripts

This directory contains helper scripts for setting up and developing the MDOffice - Markdown Office Editor extension on Windows.

## Available Scripts

### 🔍 check-requirements.bat

Checks if all required tools are installed on your system.

**What it checks:**
- Node.js installation and version
- npm installation and version
- VS Code/Cursor installation

**Usage:**
```bash
.\scripts\check-requirements.bat
```

**When to use:**
- Before starting development
- When troubleshooting setup issues
- To verify your environment

---

### 🛠️ install.bat

Complete installation script that builds and packages the extension.

**What it does:**
1. Installs npm dependencies
2. Compiles TypeScript to JavaScript
3. Creates a `.vsix` package file

**Usage:**
```bash
.\scripts\install.bat
```

**When to use:**
- For production installation
- To create a distributable package
- Before manually installing the extension in VS Code/Cursor

**After running:**
1. Open VS Code/Cursor
2. Go to Extensions (`Ctrl+Shift+X`)
3. Click the `...` menu
4. Select "Install from VSIX..."
5. Choose the generated `.vsix` file

---

### 🏷️ rename-to-md-office.bat / rename-to-md-office.ps1

Renames the extension to "MD Office" consistently throughout the project.

**What it does:**
1. Updates `package.json` with new name (`md-office`) and display name (`MD Office`)
2. Updates `README.md` title with new branding
3. Updates `CHANGELOG.md` with new name
4. Updates `CONTRIBUTING.md` with new name
5. Updates all documentation files in `docs/`
6. Offers to delete old `.vsix` files

**Usage:**
```bash
.\scripts\rename-to-md-office.bat
```

Or run PowerShell script directly:
```bash
.\scripts\rename-to-md-office.ps1
```

**When to use:**
- When you want to rebrand the extension to "MD Office"
- To ensure consistent naming across all files
- Before creating a new package with the updated name

**After running:**
1. Review the changes
2. Run `npm run compile`
3. Run `npm run package`
4. New package will be named: `md-office-0.2.0.vsix`

---

### 🔧 dev.bat

Starts the development environment with auto-compilation.

**What it does:**
1. Installs/updates dependencies
2. Starts TypeScript compiler in watch mode
3. Auto-recompiles on file changes

**Usage:**
```bash
.\scripts\dev.bat
```

**When to use:**
- During active development
- When making code changes
- To avoid manual recompilation

**To stop:** Press `Ctrl+C`

**Development workflow:**
1. Run this script in a terminal
2. Open another VS Code/Cursor window
3. Press `F5` to start Extension Development Host
4. Make changes to source files
5. Changes auto-compile
6. Reload Extension Development Host to test (`Ctrl+R`)

---

## Manual Commands

If you prefer to run commands manually instead of using scripts:

### Install dependencies:
```bash
npm install
```

### Compile once:
```bash
npm run compile
```

### Compile with watch mode:
```bash
npm run watch
```

### Create VSIX package:
```bash
npm run package
```

### Run linter:
```bash
npm run lint
```

---

## Troubleshooting

### "Node.js is NOT installed"
Download and install Node.js LTS from: https://nodejs.org/

### "npm is NOT installed"
npm comes with Node.js. Reinstall Node.js if npm is missing.

### "'code' command not found"
This is just a warning. Make sure VS Code or Cursor is installed. The extension will still work.

### "Failed to compile TypeScript"
1. Make sure all dependencies are installed: `npm install`
2. Check for syntax errors in TypeScript files
3. Verify TypeScript version: `npx tsc --version`

### "Failed to create VSIX package"
1. Install vsce globally: `npm install -g @vscode/vsce`
2. Make sure compilation succeeded first
3. Check that `package.json` is valid

---

## Cross-Platform Note

These scripts are written for **Windows** using `.bat` files.

**For macOS/Linux users:**

Create equivalent shell scripts or run npm commands directly:

```bash
# Check requirements
node --version
npm --version

# Install and compile
npm install
npm run compile

# Watch mode
npm run watch

# Package
npm run package
```

---

## Need Help?

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed development setup and guidelines.

