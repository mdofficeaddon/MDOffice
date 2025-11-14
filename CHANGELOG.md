# Changelog

All notable changes to the "MDOffice - Markdown Office Editor" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed 🐛
- **Markdown File Link Fix**: Fixed issue with underscores in linked filenames
  - Previously, links like `[Test](./TEST_IMAGES.md)` were failing with "File not found: ./TEST<em>IMAGES</em>.md"
  - Root cause: Italic/emphasis parsing was converting underscores to `<em>` tags before link processing
  - Solution: Reordered markdown parsing to process links before bold/italic formatting
  - Now correctly preserves all special characters in link URLs
  - Added comprehensive test suite for links with underscores
- **Image Button Fix**: Fixed image button functionality with improved dialog interface
  - Replaced prompt-based UI with modern HTML dialog
  - Added detailed logging for debugging
  - Added element existence checks before attaching event listeners
  - Improved error handling with try-catch blocks
- **Clipboard Image Paste**: Enhanced logging for clipboard image paste functionality
  - Better debugging output for troubleshooting
  - Improved error messages when paste fails

## [0.2.7] - 2025-11-14

### Added ✨
- **🖼️ Enhanced Image Support**: Complete overhaul of image insertion capabilities
  - **File Browser**: Select images from file system with native file picker
    - Supports PNG, JPG, JPEG, GIF, SVG, BMP, WEBP formats
    - Choose between relative path, absolute path, or base64 embedding
  - **Drag & Drop**: Drag images directly from file explorer into editor or preview
    - Automatically saves to `images/` folder
    - Inserts markdown with relative path
  - **Clipboard Paste**: Paste images directly with Ctrl+V (Cmd+V on Mac)
    - Works with screenshots, copied images from web, etc.
    - Auto-saves as `images/pasted-image-[timestamp].png`
  - **URL Support**: Insert images from online URLs (HTTP/HTTPS)
  - **Base64 Support**: Embed images directly in markdown
  - **Enhanced Image Button**: Three-option menu (Browse/URL/Clipboard instructions)

- **Smart Link Navigation**: Comprehensive support for markdown file links and anchor navigation
  - **Markdown File Links**: Click any `.md` or `.markdown` link to open it in MDOffice editor
    - Visual indicator: Green color with 📄 icon
    - Automatic relative path resolution
    - Examples: `[Guide](./docs/guide.md)`, `[README](../README.md)`
  
  - **Anchor Links**: Jump to specific headings within the same document
    - Visual indicator: Purple color
    - Smooth scrolling animation
    - Works with all heading levels (H1-H6)
    - Example: `[Go to Features](#features)`
  
  - **Combined File + Anchor**: Open another file AND jump to a specific section
    - Opens the target markdown file in MDOffice
    - Automatically scrolls to the specified heading
    - Brief yellow highlight on target heading
    - Example: `[API Setup](./api.md#authentication)`
  
  - **Automatic Heading IDs**: All headings now get slugified IDs for anchor linking
    - `## Getting Started` → `id="getting-started"`
    - `## API & SDK` → `id="api-sdk"`
    - No manual configuration needed
  
  - **Enhanced External Links**: HTTP/HTTPS links open in browser with security attributes
    - Opens in new tab with `rel="noopener noreferrer"`
    - Visual indicator: Standard blue link color
  
  - **Visual Feedback System**:
    - Hover tooltips show link destinations
    - Color-coded link types (green, purple, blue)
    - Smooth scroll animations
    - Temporary heading highlights

### Fixed 🔧
- **Critical: Image Display**: Fixed markdown parsing order that prevented images from rendering
  - Images are now processed before links to prevent regex conflicts
  - Resolves issue where images appeared as text (e.g., "!Screenshot 1")
- **Local Image Paths**: Relative image paths now work correctly in preview
  - Extended `localResourceRoots` to include document directory
  - Automatic conversion of relative paths to webview URIs
  - Handles paths with spaces and special characters (URL encoding/decoding)
- **Content Security Policy**: Updated CSP to allow images from all sources
  - `img-src` now includes webview resources, data URIs, HTTP/HTTPS, and file protocol

### Improved 🚀
- **Image Path Resolution**: Smart handling of different path types
  - Relative paths: `./images/photo.png` → webview URI
  - Absolute paths: Full system paths → webview URI  
  - URLs: `https://...` → direct (no conversion)
  - Data URIs: `data:image/...` → direct (no conversion)
- **Image Organization**: Automatic folder structure
  - Pasted/dropped images saved to `images/` folder
  - Maintains clean project organization
- **Developer Experience**: Added debug logging for image path resolution
  - Console logs show original path, cleaned path, and resolved URI
  - Visual error indicators (red border) for failed image loads
- **Link Type Recognition**: Intelligent detection of different link formats
  - Markdown files (.md, .markdown)
  - Anchor links (starting with #)
  - External links (http://, https://)
  - Mailto links
  - Data URIs
- **Documentation Navigation**: Create interconnected markdown files like a wiki
- **Dark Theme Support**: All link colors optimized for both light and dark themes

## [0.2.6] - 2025-11-14

### Fixed 🔧
- **Toolbar Buttons (Bold, Italic, etc.)**: Fixed critical issue where formatting buttons didn't work when clicked
  - Problem: Clicking buttons caused focus to shift away from editor, breaking functionality
  - Solution: Implemented `lastActiveEditor` tracking to remember which editor was active
  - All formatting buttons now work reliably in both Editor and Preview modes
  - Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.) continue to work as before

- **Export Buttons (HTML/PDF)**: Fixed non-functional export buttons in toolbar
  - Export buttons now properly trigger VS Code commands
  - Added comprehensive error handling and logging
  - Export dialog now appears correctly when clicking toolbar buttons
  - Both "Export HTML" and "Export PDF" buttons fully functional

### Improved 🚀
- **Export HTML/PDF Quality**: Complete rewrite of markdown parser using markdown-it library
  - **Tables**: Now properly converted to HTML `<table>` with `<thead>` and `<tbody>`
    - Support for table alignment (left, center, right)
    - Proper handling of special characters in tables
    - Empty cells handled correctly
    - Complex tables with formatting (bold, italic, code, links) work perfectly
  
  - **Checklists/Task Lists**: Fully functional checkbox conversion
    - `- [ ]` converts to proper HTML checkboxes
    - `- [x]` converts to checked checkboxes
    - Nested task lists with unlimited depth
    - Empty checkboxes (just `- [ ]`) handled correctly
    - Task lists with formatting (bold, italic, code, links) work
    - 6-pass regex system ensures ALL checkboxes are converted
  
  - **Nested Lists**: Perfect rendering of multi-level lists
    - Bullet lists (ul) with proper nesting
    - Numbered lists (ol) with proper nesting
    - Mixed nested lists (bullets inside numbers, etc.)
    - Proper progressive styling (disc → circle → square)
    - Numbered lists use progressive styles (1,2,3 → a,b,c → i,ii,iii)
  
  - **Blockquotes**: Proper nested blockquote support
    - Multi-level blockquotes render correctly
    - Formatting inside blockquotes preserved
  
  - **Code Blocks**: Language-specific syntax highlighting preserved
  - **Links and Images**: Proper conversion with alt text and titles
  - **Horizontal Rules**: Correctly converted from `---` or `***`

- **Export Styling**: Enhanced CSS for professional document output
  - **Deep Nesting Support**: Special styling for lists up to 6+ levels
    - Progressive spacing reduction for deeper levels
    - Visual depth indicators (subtle borders)
    - Background shading for very deep nesting (level 4+)
    - Bullet style progression (disc → circle → square → repeat)
    - Ordered list style progression (1,2,3 → a,b,c → i,ii,iii → repeat)
  
  - **Task List Styling**: Matches Office View appearance
    - Hover effects on task items
    - Checkboxes with hover states
    - Strikethrough for completed tasks
    - Visual hierarchy with connecting lines for nested tasks
    - Progressive blue-tinted background for depth
    - Proper spacing between task levels
  
  - **Professional Typography**: Clean, readable output
    - GitHub-flavored styling
    - Proper line heights and spacing
    - Responsive design for different screen sizes

### Technical 🔧
- **Error Handling**: Comprehensive logging throughout export pipeline
  - Console logs for debugging export issues
  - Try-catch blocks prevent silent failures
  - User-friendly error messages
- **Code Quality**: TypeScript type safety improvements
  - Proper type annotations for regex callbacks
  - @ts-ignore for markdown-it import (no types available)
- **Parser Robustness**: Multiple-pass regex system for complex edge cases
  - Pass 1: Handles `<li><p>[x]</p><nested>content</nested></li>`
  - Pass 2: Handles empty checkboxes in paragraphs
  - Pass 3: Handles bare checkboxes without tags
  - Pass 4: Handles inline checkboxes with nested content
  - Pass 5: Line-by-line processing for missed patterns
  - Pass 6: Cleanup pass for unclosed spans
  - Recursive loop for nested `task-list` class application

### Developer Notes 📝
- Export now uses `markdown-it` library instead of custom regex parser
- Post-processing handles task lists (not natively supported by markdown-it)
- HTML output compatible with print-to-PDF in browsers
- CSS designed for both screen viewing and PDF generation

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
