# Markdown Office Editor

[![Version](https://img.shields.io/visual-studio-marketplace/v/MDOffice.md-office-editor?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=MDOffice.md-office-editor)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/MDOffice.md-office-editor)](https://marketplace.visualstudio.com/items?itemName=MDOffice.md-office-editor)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/MDOffice.md-office-editor)](https://marketplace.visualstudio.com/items?itemName=MDOffice.md-office-editor)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub](https://img.shields.io/github/stars/mdofficeaddon/MDOffice?style=social)](https://github.com/mdofficeaddon/MDOffice)

Transform your VS Code or Cursor into a powerful **Office-like markdown editor**! Edit documents visually with rich formatting tools, WYSIWYG preview editing, search & replace, and professional export options - all in a familiar, user-friendly interface.

> 🎯 **Perfect for**: Technical writers, bloggers, documentation maintainers, students, and anyone who loves markdown but wants a more visual editing experience!

## 📸 Screenshots

> **Screenshots coming soon!** Add your screenshots to the `screenshots/` directory and update this section before publishing.

<!-- Recommended screenshots to add:
1. screenshots/main-interface.png - Split view with editor and preview
2. screenshots/preview-editing.png - WYSIWYG editing in action
3. screenshots/search-replace.png - Find and replace dialog
4. screenshots/toolbar.png - Rich formatting toolbar
5. screenshots/focus-mode.png - Distraction-free writing mode

Example markdown once you add screenshots:
![Main Interface](screenshots/main-interface.png)
*Split view with editor and preview side-by-side*
-->

## ✨ Features

### 🎨 Office-Like Interface
- **Rich Toolbar**: Quick access to all formatting options with visual buttons
- **Split View**: Edit and preview side-by-side in real-time
- **Multiple View Modes**: Switch between Editor Only, Preview Only, or Split View
- **Status Bar**: Track lines, words, character counts, reading time, and word count goals
- **Dark Theme Support**: Auto-detects VS Code theme or manual override
- **Focus Mode**: Distraction-free writing (F11 or Esc to exit)

### 📝 Rich Editing Features
- **Text Formatting**: Bold, Italic, Strikethrough, Inline Code
- **Headings**: Quick insertion of H1, H2, H3
- **Lists**: Bullet lists, numbered lists, and task lists
- **Insert Elements**: Links, images, tables, and code blocks
- **✨ NEW: Edit in Preview Mode**: Full WYSIWYG editing directly in preview!
  - All toolbar buttons work in preview mode
  - Keyboard shortcuts work everywhere
  - Changes automatically sync to markdown
  - Perfect for visual editing
- **Fully Customizable**:
  - Adjustable margins (0-200px)
  - Font size (8-24pt)
  - Font family (5 options)
  - Line height (1.0-3.0)
- **Keyboard Shortcuts**: 
  - `Ctrl+B` / `Cmd+B` - Bold
  - `Ctrl+I` / `Cmd+I` - Italic
  - `Ctrl+K` / `Cmd+K` - Insert Link
  - `Ctrl+F` / `Cmd+F` - Search with highlighting
  - `Ctrl+H` / `Cmd+H` - **✨ NEW: Find and Replace**
  - `Ctrl+S` / `Cmd+S` - Save
  - `Ctrl+Shift+V` / `Cmd+Shift+V` - Toggle View Mode
  - `F11` - Toggle Focus Mode
  - `Esc` - Exit Focus Mode or Close Search/Replace

### 🔄 Live Preview with Editing
- Real-time markdown rendering
- **✨ NEW: Editable Preview**: Edit directly in preview mode with full formatting support
- **Synchronized scrolling** with toggle control
- GitHub-flavored markdown support
- Syntax highlighting for code blocks
- Dark theme support
- **Task Lists (Checklists)**: Full support for `- [ ]` and `- [x]` with nesting and interactive checkboxes
- **Nested Lists**: Proper rendering of nested ordered/unordered lists
- **Nested Blockquotes**: Full support for multi-level blockquotes with distinct styling
- **Table Alignment**: Proper header/content alignment with horizontal scrolling for wide tables
- **Bidirectional Sync**: Changes in preview automatically convert back to markdown

### 📑 Navigation & Productivity
- **Search with Highlighting** (`Ctrl+F`): Find text across all views with visual highlighting
  - Yellow highlight for all matches
  - Orange highlight with outline for current match
  - Auto-search as you type
  - Navigate with Previous/Next buttons
  - Works in both editor and preview
- **Table of Contents**: Auto-generated from headings with click-to-navigate
- **Word Count Goals**: Set targets and track progress
- **Reading Time Estimate**: Based on average reading speed
- **Autosave Indicator**: Visual feedback for save status
- **Remember View Mode**: Restores your preferred view per workspace

### 📤 Export Options
- Export to HTML with configurable settings
- Export to PDF (via HTML + browser print)
- **Configurable paper size**: Letter, A4, Legal
- **Adjustable export margins**: Independent from editor margins

### 🎛️ Advanced Customization
- **17 configuration settings** for complete personalization
- **Custom CSS support**: Load your own stylesheet
- **Per-workspace preferences**: Settings saved per project
- **Theme options**: Auto, Light, or Dark document themes

## 🚀 Installation

### From VS Code / Cursor Marketplace (Recommended)

1. Open **VS Code** or **Cursor**
2. Go to **Extensions** (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for **"Markdown Office Editor"**
4. Click **Install**
5. Open any `.md` file and right-click → **"Open with Markdown Office Editor"**

### From VSIX File

If you have a `.vsix` file:

1. Open VS Code / Cursor
2. Go to Extensions → Click the `...` menu → **Install from VSIX**
3. Select the `.vsix` file
4. Reload the editor

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/mdofficeaddon/MDOffice.git
   cd MDOffice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the extension:
   ```bash
   npm run compile
   ```

4. Open the project in VS Code/Cursor:
   ```bash
   code .
   ```

5. Press `F5` to launch the Extension Development Host

### Package as VSIX

1. Install vsce if you haven't already:
   ```bash
   npm install -g @vscode/vsce
   ```

2. Package the extension:
   ```bash
   npm run package
   ```

3. Install the .vsix file:
   - In VS Code/Cursor: Extensions → `...` menu → Install from VSIX

## 📖 Usage

### Opening Files

1. **Right-click on any .md file** in the Explorer
2. Select **"Open with Markdown Office Editor"**

Or:

1. Open a markdown file in the default editor
2. Run command `Markdown: Open with Markdown Office Editor` from Command Palette (`Ctrl+Shift+P`)

### Toolbar Guide

#### File Operations
- 💾 **Save** - Save the current document
- 📄 **Export HTML** - Export to HTML with configurable settings
- 📑 **Export PDF** - Export to PDF via HTML

#### Text Formatting
- **B** - Bold text (Ctrl+B)
- **I** - Italic text (Ctrl+I)
- **S** - Strikethrough
- **</>** - Inline code

#### Headings
- **H1** - Insert Heading 1
- **H2** - Insert Heading 2
- **H3** - Insert Heading 3

#### Lists
- **• List** - Bullet list
- **1. List** - Numbered list
- **☑ Task** - Task list with checkbox

#### Insert Elements
- **🔗 Link** - Insert hyperlink (Ctrl+K)
- **🖼️ Image** - Insert image
- **📊 Table** - Insert table
- **{ } Code** - Insert code block

#### View Controls
- **🔄 Sync** - Toggle synchronized scrolling
- **📑 TOC** - Toggle table of contents sidebar
- **🎯 Focus** - Toggle focus mode (F11)

### Editing in Preview Mode (NEW!)

**Preview mode now supports full editing with all features!**

1. **Switch to Preview Only** mode using the toolbar dropdown
2. **Click anywhere** in the preview to start editing
3. **Use all toolbar buttons** - Bold, Italic, Headings, Lists, etc.
4. **Use keyboard shortcuts** - Ctrl+B for bold, Ctrl+I for italic, etc.
5. **Type directly** - Just like editing in Word or Google Docs!
6. **Your changes automatically sync** back to the markdown source

This is perfect for:
- Visual editing without thinking about markdown syntax
- Quick formatting changes
- Editing complex tables and lists
- WYSIWYG editing experience

### Search and Replace (NEW!)

**Powerful find and replace functionality with support for both editor and preview modes!**

#### How to Use:
1. **Open Search**: Press `Ctrl+F` (or `Cmd+F` on Mac)
2. **Enable Replace**: 
   - Click the **⇅** button in the search dialog, or
   - Press `Ctrl+H` (or `Cmd+H` on Mac) to open directly in replace mode

#### Features:
- **Case-insensitive search** - Finds matches regardless of case
- **Real-time highlighting** - All matches highlighted as you type
- **Navigate matches** - Previous/Next buttons to jump between results
- **Replace current** - Replace one match at a time (Enter in replace field)
- **Replace all** - Replace all matches at once (Ctrl+Enter in replace field)
- **Works in both modes** - Functions in editor view or editable preview
- **Undo support** - All replace operations can be undone (Ctrl+Z)

#### Keyboard Shortcuts:
- `Ctrl+F` / `Cmd+F` - Open search dialog
- `Ctrl+H` / `Cmd+H` - Open find and replace
- `Enter` - Replace current match and move to next
- `Ctrl+Enter` - Replace all matches
- `Esc` - Close search/replace dialog

See [PREVIEW_EDITING_GUIDE.md](docs/PREVIEW_EDITING_GUIDE.md) for detailed documentation.

### View Modes

Switch between three view modes using the dropdown in the toolbar or press `Ctrl+Shift+V` to cycle:

- **Split View** - Editor and preview side-by-side (default)
- **Editor Only** - Focus on editing
- **Preview Only** - Focus on rendered output

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "Markdown Office Editor".

### Document Appearance
- `mdOfficeEditor.pageMargins` - Page margins in pixels (default: 48)
- `mdOfficeEditor.fontSize` - Font size in points (default: 11, range: 8-24)
- `mdOfficeEditor.fontFamily` - Font family (Calibri, Times New Roman, Arial, Georgia, Courier New)
- `mdOfficeEditor.lineHeight` - Line height/spacing (default: 1.08, range: 1.0-3.0)
- `mdOfficeEditor.documentTheme` - Document theme (auto, light, dark)

### View Settings
- `mdOfficeEditor.defaultViewMode` - Default view when opening files (split, editor, preview)
- `mdOfficeEditor.rememberViewMode` - Remember last used view mode (default: true)
- `mdOfficeEditor.syncScroll` - Enable synchronized scrolling (default: true)

### Productivity
- `mdOfficeEditor.wordCountGoal` - Word count goal (0 = disabled)
- `mdOfficeEditor.showReadingTime` - Show reading time estimate (default: true)

### Export
- `mdOfficeEditor.export.paperSize` - Paper size for exports (Letter, A4, Legal)
- `mdOfficeEditor.export.margins` - Export margins in pixels (default: 48)

### Focus Mode
- `mdOfficeEditor.focusMode.hideToolbar` - Hide toolbar in focus mode (default: true)
- `mdOfficeEditor.focusMode.hideStatusBar` - Hide status bar in focus mode (default: true)

### Advanced
- `mdOfficeEditor.customCss` - Path to custom CSS file for styling

📚 **For detailed configuration guide, see [USER_GUIDE.md](docs/USER_GUIDE.md)**

## 🛠️ Development

### Project Structure

```
md-office-editor/
├── src/                      # Source TypeScript files
│   ├── extension.ts          # Extension entry point
│   ├── markdownEditorProvider.ts  # Custom editor provider
│   ├── webviewContent.ts     # Webview HTML/CSS/JS generation
│   ├── exportService.ts      # Export functionality (PDF/HTML)
│   └── util.ts               # Utility functions
├── out/                      # Compiled JavaScript (generated)
├── tests/                    # Test files and example documents
├── docs/                     # Extended documentation
├── scripts/                  # Build and setup scripts
├── screenshots/              # Extension screenshots
├── package.json              # Extension manifest and metadata
├── tsconfig.json             # TypeScript configuration
├── CHANGELOG.md              # Version history
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # MIT License
└── README.md                 # This file
```

### Building

```bash
npm run compile
```

### Watch Mode

For development with auto-compilation:

```bash
npm run watch
```

### Testing

Press `F5` in VS Code/Cursor to launch the Extension Development Host with your extension loaded.

## 🎯 Roadmap

### ✅ Completed Features
- [x] Basic markdown editing with syntax support
- [x] Office-like toolbar interface
- [x] Live preview with real-time rendering
- [x] Text formatting (bold, italic, strikethrough, inline code)
- [x] Headings (H1, H2, H3) and lists (bullet, numbered, task)
- [x] Insert links, images, tables, and code blocks
- [x] Multiple view modes (Split, Editor Only, Preview Only)
- [x] Status bar with document stats (words, chars, lines, reading time)
- [x] Synchronized scrolling with toggle control
- [x] Export to HTML with configurable settings
- [x] Export to PDF via HTML rendering
- [x] Search with real-time highlighting
- [x] Find and replace functionality
- [x] Table of contents view with navigation
- [x] Focus mode for distraction-free writing
- [x] WYSIWYG preview editing
- [x] Interactive task lists (checkboxes)
- [x] Nested lists and blockquotes support
- [x] Dark theme support with auto-detection
- [x] Custom CSS support
- [x] Word count goals and tracking
- [x] Configurable fonts, margins, and spacing

### 🚀 Planned Features
- [ ] Visual table editor with drag-to-resize
- [ ] Image drag-and-drop from file system
- [ ] Image paste from clipboard
- [ ] Math/LaTeX rendering improvements
- [ ] Markdown syntax validation and linting
- [ ] Spell checker integration
- [ ] Additional export formats (DOCX, Markdown flavors)
- [ ] Custom theme templates
- [ ] Collaborative editing hints
- [ ] Git integration for version tracking
- [ ] Advanced find/replace with regex support
- [ ] Outline view in sidebar panel
- [ ] Snippet library for common markdown patterns

## 🤝 Contributing

Contributions are welcome! Whether it's bug reports, feature suggestions, or code contributions, your input helps make this extension better.

**Before contributing:**
- Read the [Contributing Guidelines](CONTRIBUTING.md)
- Check existing [issues](https://github.com/mdofficeaddon/MDOffice/issues)
- Follow the code style and testing guidelines

**Ways to contribute:**
- 🐛 Report bugs or issues
- 💡 Suggest new features or improvements
- 📝 Improve documentation
- 🔧 Submit pull requests with fixes or features
- ⭐ Star the project if you find it useful!

## 📄 License

MIT License - feel free to use this extension for any purpose.

## 🐛 Issues & Support

Found a bug or have a feature request? 

**[Open an issue on GitHub](https://github.com/mdofficeaddon/MDOffice/issues)**

When reporting bugs, please include:
- Operating system and version
- VS Code/Cursor version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 💡 Tips

- Use keyboard shortcuts for faster editing
- The editor auto-saves after 1 second of inactivity
- You can still use your favorite markdown syntax directly in the editor
- The preview updates in real-time as you type
- Right-click on .md files to quickly open with this editor

## 🙏 Acknowledgments

Built with:
- [Visual Studio Code Extension API](https://code.visualstudio.com/api)
- [TypeScript](https://www.typescriptlang.org/)
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown parser

Special thanks to:
- The VS Code team for their excellent extension API
- The Cursor team for their enhanced IDE experience
- All contributors and users who provide feedback and suggestions

---

## 📚 Documentation

- [User Guide](docs/USER_GUIDE.md) - Comprehensive usage guide
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute
- [Changelog](CHANGELOG.md) - Version history
- [Publishing Guide](docs/PUBLISHING.md) - For extension publishers
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

---

**Enjoy writing beautiful markdown documents with an Office-like experience!** ✨

If you find this extension helpful, please consider:
- ⭐ Starring the project on GitHub
- 📝 Writing a review on the marketplace
- 🐦 Sharing it with others
- ☕ Supporting the development


