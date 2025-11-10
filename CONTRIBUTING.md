# Contributing to Markdown Office Editor

First off, thank you for considering contributing to Markdown Office Editor! It's people like you that make this extension better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)

## Code of Conduct

This project and everyone participating in it is governed by basic principles of respect and professionalism. Please be kind, considerate, and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10, macOS 12.0, Linux Ubuntu 22.04]
 - VS Code/Cursor Version: [e.g. 1.75.0]
 - Extension Version: [e.g. 0.2.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** - Use a descriptive title for the issue
- **Detailed description** - Provide a step-by-step description of the suggested enhancement
- **Use cases** - Explain why this enhancement would be useful to most users
- **Mockups** - If applicable, include mockups or examples

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if you're adding new features
5. **Write clear commit messages** describing what you changed and why
6. **Submit a pull request** with a clear description

**Pull Request Template:**

```markdown
**Description**
A clear description of what this PR does.

**Type of change**
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

**Testing**
Describe the tests you ran to verify your changes.

**Checklist:**
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested this works in VS Code and Cursor (if applicable)
```

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- VS Code or Cursor IDE
- TypeScript knowledge

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/md-office-editor.git
   cd md-office-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile the extension**
   ```bash
   npm run compile
   ```

4. **Open in VS Code/Cursor**
   ```bash
   code .
   ```

5. **Run the extension**
   - Press `F5` to open the Extension Development Host
   - Open a `.md` file
   - Right-click → "Open with Markdown Office Editor"

### Development Workflow

**Watch mode for auto-compilation:**
```bash
npm run watch
```

**Manual compilation:**
```bash
npm run compile
```

**Package as VSIX:**
```bash
npm run package
```

## Project Structure

```
md-office-editor/
├── src/                          # Source TypeScript files
│   ├── extension.ts              # Extension entry point
│   ├── markdownEditorProvider.ts # Custom editor provider
│   ├── webviewContent.ts         # Webview HTML/CSS/JS generation
│   ├── exportService.ts          # Export functionality (PDF/HTML)
│   └── util.ts                   # Utility functions
├── out/                          # Compiled JavaScript (generated)
├── tests/                        # Test files and example documents
├── docs/                         # Documentation files
├── scripts/                      # Build and setup scripts
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Main documentation
```

## Style Guidelines

### TypeScript Style

- Use **TypeScript** for all new code
- Follow existing code formatting (2-space indentation)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Avoid `any` type - use proper typing
- Use `async/await` for asynchronous operations

**Example:**
```typescript
/**
 * Formats the markdown content with the specified style
 * @param content The markdown content to format
 * @param style The formatting style to apply
 * @returns The formatted markdown content
 */
async function formatMarkdown(content: string, style: FormatStyle): Promise<string> {
  // Implementation
}
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add table alignment controls
fix: cursor position bug in preview editing
docs: update installation instructions
refactor: simplify markdown parser logic
```

### Code Comments

- Write self-documenting code when possible
- Add comments for complex logic
- Use JSDoc for public APIs
- Keep comments up-to-date with code changes

## Testing

### Manual Testing

1. Test all view modes (Split, Editor Only, Preview Only)
2. Test formatting buttons (Bold, Italic, etc.)
3. Test keyboard shortcuts
4. Test in both light and dark themes
5. Test with large documents (1000+ lines)
6. Test search and replace functionality
7. Test export features (HTML, PDF)
8. Test on different operating systems if possible

### Test Documents

Use the example documents in the `tests/` directory to verify your changes work with:
- Tables with special characters
- Nested lists and blockquotes
- Math/LaTeX expressions
- Code blocks with syntax highlighting
- Task lists (checklists)

### Regression Testing

Before submitting a PR, ensure:
- Existing features still work
- No new console errors
- Performance hasn't degraded
- Extension loads and activates properly

## Questions?

Feel free to open an issue with the `question` label if you need help or clarification.

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Thank you for contributing! 🎉**

