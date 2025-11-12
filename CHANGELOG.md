# Changelog

All notable changes to the "MDOffice - Markdown Office Editor" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.5] - 2025-11-12

### Added
- **Tab Key Support**: Full support for Tab/Shift+Tab list indentation in both editor and preview modes
  - Tab indents list items (2 spaces for lists, 4 spaces for general text in editor)
  - Shift+Tab outdents list items
  - Works seamlessly with bullet lists, numbered lists, and task lists
- **Smart List Conversion**: Intelligent transformation of selected text into lists
  - Converts multiple lines into bullet, numbered, or task lists
  - Automatically inserts new list items when no text is selected
  - Works in both editor and preview modes
- **Split View Editing**: Preview panel is now fully editable in split view mode
  - Edit directly in preview while viewing markdown source
  - Bidirectional sync between both panels
- **Intelligent Content Insertion**: Toolbar buttons work without selection
  - Heading buttons insert new headings at cursor or end of document
  - List buttons insert new list items when no text is selected

### Improved
- **View Mode Names**: Renamed for better clarity
  - "Preview Only" → "Office View"
  - "Editor Only" → "Editor View"
- **Heading Functionality**: Enhanced heading buttons behavior
  - Apply heading styles to entire current line in editor mode
  - Convert current block to heading in preview mode
  - No selection required - works at cursor position
- **Toolbar Button Focus**: Proper focus management after toolbar actions
  - Buttons restore focus to active editor (preview or markdown)
  - Prevents cursor from jumping to top of document
  - Try-catch error handling prevents UI disruptions
- **Nested List Rendering**: Completely rewritten list parser
  - Correct HTML structure with nested `<ul>/<ol>` inside `<li>` elements
  - Proper indentation in generated Markdown
  - Handles deeply nested lists (5+ levels) correctly
  - Maintains proper structure for mixed list types
- **Performance Optimization**: Reduced sync delays for more responsive editing
  - Preview sync: 300ms (down from 1000ms)
  - Undo save timeout: 1000ms (down from 2000ms)
  - Table manipulation: 50ms (down from 100ms)
- **UI Refinement**: Cleaner, more professional interface
  - Removed borders around text areas
  - Removed box shadows on focus for distraction-free editing

### Fixed
- **Toolbar Usability**: Major fixes to toolbar button functionality
  - Buttons now respond reliably in all view modes
  - Fixed cursor jumping to top when errors occur
  - Proper error handling prevents UI corruption
- **Nested Lists in Office View**: Fixed rendering and editing
  - Correct display of multi-level nested lists
  - Ability to create and edit nested lists directly in Office View
  - Proper conversion between HTML and Markdown for complex nesting
- **Keyboard Shortcuts**: Fixed conflicts with VS Code
  - Ctrl+B (Bold) no longer toggles VS Code sidebar
  - Added `stopPropagation()` to prevent event bubbling
- **Heading Behavior**: Enter key after headings returns to paragraph
  - Pressing Enter in a heading creates a new paragraph
  - No longer continues heading formatting on next line
- **List Parsing Edge Cases**: Resolved issues with complex nested structures
  - Task lists with multiple nesting levels
  - Mixed bullet and numbered lists
  - Lists with varying indentation levels

## [0.2.4] - 2025-11-12

### Changed
- Cleaned up development documentation files from root directory
- Improved project structure and organization

### Maintenance
- Removed residual markdown files from root (moved to docs-internal)
- Better separation of user-facing and internal documentation

## [0.2.3] - 2025-11-11

### Fixed
- Fixed publisher ID configuration for marketplace publishing
- Updated extension publishing workflow and documentation

### Changed
- Improved publishing documentation with detailed guides for VS Code Marketplace and Open VSX

## [0.2.2] - 2025-11-10

### Fixed
- Updated Marketplace badge links to use correct publisher ID
- Fixed GitHub issues link in README
- All marketplace links now point to the correct extension page

## [0.2.0] - 2025-11-10

### Added
- **WYSIWYG Preview Editing**: Full editing capabilities directly in preview mode
  - All toolbar buttons work in preview
  - Keyboard shortcuts functional in preview
  - Bidirectional sync between preview and markdown
- **Find and Replace** (Ctrl+H / Cmd+H):
  - Case-insensitive search
  - Real-time highlighting of all matches
  - Replace current or replace all functionality
  - Navigate between matches with Previous/Next
- **Interactive Checklists**: Full support for task lists with nesting
  - Clickable checkboxes in preview
  - Proper rendering of nested task lists
  - Automatic markdown sync when toggling
- **Enhanced Search** (Ctrl+F / Cmd+F):
  - Visual highlighting in both editor and preview
  - Auto-search as you type
  - Navigate between results
- **Table of Contents**: Auto-generated from headings with click-to-navigate
- **Word Count Goals**: Set targets and track progress in status bar
- **Reading Time Estimate**: Based on average reading speed (200 WPM)
- **Focus Mode** (F11): Distraction-free writing mode
  - Configurable toolbar/status bar hiding
  - Esc to exit

### Improved
- **Table Rendering**: 
  - Proper header and content alignment
  - Horizontal scrolling for wide tables
  - Better handling of special characters
- **Nested Lists**: Improved rendering of multi-level lists
- **Nested Blockquotes**: Distinct styling for each nesting level
- **Dark Theme Support**: Better auto-detection and manual override
- **Keyboard Shortcuts**: More comprehensive coverage across all modes
- **Status Bar**: Enhanced with autosave indicator and statistics
- **Synchronized Scrolling**: Improved accuracy with toggle control

### Fixed
- Cursor position accuracy in preview mode
- Table column alignment issues
- Nested list rendering bugs
- Blockquote nesting display
- Theme switching behavior
- Save state persistence

## [0.1.0] - 2025-10-11

### Added
- Initial release of MDOffice - Markdown Office Editor
- Office-like interface with rich toolbar
- Basic markdown editing features:
  - Text formatting (Bold, Italic, Strikethrough, Code)
  - Headings (H1, H2, H3)
  - Lists (Bullet, Numbered, Task)
  - Insert elements (Links, Images, Tables, Code blocks)
- Split view mode (Editor + Preview side-by-side)
- Multiple view modes:
  - Split View
  - Editor Only
  - Preview Only
- Live preview with real-time rendering
- Status bar with document statistics:
  - Line count
  - Word count
  - Character count
- Export functionality:
  - Export to HTML
  - Export to PDF (via HTML)
- Configuration settings:
  - Adjustable page margins
  - Font size and family
  - Line height
  - Default view mode
  - Synchronized scrolling toggle
  - Document theme (auto/light/dark)
- Keyboard shortcuts:
  - Ctrl/Cmd+B for Bold
  - Ctrl/Cmd+I for Italic
  - Ctrl/Cmd+K for Insert Link
  - Ctrl/Cmd+S for Save
  - Ctrl/Cmd+Shift+V for Toggle View
- Custom editor integration:
  - Right-click context menu
  - "Open with MDOffice - Markdown Office Editor" option
- GitHub-flavored markdown support
- Syntax highlighting for code blocks
- Auto-save after 1 second of inactivity

### Initial Features
- Custom VS Code editor for `.md` files
- TypeScript-based implementation
- Markdown-it parser integration
- Real-time preview rendering
- Webview-based preview panel

---

## Release Notes

### Version 0.2.0 - Major Feature Update

This release transforms the MDOffice - Markdown Office Editor into a true WYSIWYG editor with the addition of preview editing, find & replace, and numerous quality-of-life improvements. The extension now offers a complete Office-like experience for markdown editing.

**Key Highlights:**
- Edit directly in the preview with full formatting support
- Powerful find and replace with visual highlighting
- Interactive checklists and improved list rendering
- Enhanced table support with proper alignment
- Better productivity features (TOC, word goals, reading time)

### Version 0.1.0 - Initial Release

The first public release of MDOffice - Markdown Office Editor brings an Office-like interface to markdown editing in VS Code and Cursor. With a rich toolbar, live preview, and export capabilities, it makes markdown editing more accessible and visual.

---

## Upcoming Features

See [FEATURES_CHECKLIST.md](FEATURES_CHECKLIST.md) for planned features.

Potential future additions:
- [ ] Drag-and-drop image upload
- [ ] Advanced table editor with visual controls
- [ ] Spell checker integration
- [ ] Custom themes for preview
- [ ] Collaborative editing support
- [ ] Git integration for document versions
- [ ] Template system
- [ ] Math equation visual editor
- [ ] Diagram support (Mermaid, PlantUML)
- [ ] Multi-file project view
- [ ] Export to DOCX format
- [ ] Export to LaTeX format
