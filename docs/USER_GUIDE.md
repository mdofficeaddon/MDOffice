# MDOffice - Markdown Office Editor - User Guide

## Quick Start

### Opening a Markdown File
1. Open any `.md` file in VS Code
2. Right-click in the editor and select **"Open with MDOffice - Markdown Office Editor"**
3. The editor will open in split view by default (editor + preview)

### Basic Features

#### View Modes
Switch between three view modes using the dropdown in the toolbar:
- **Split View** - Editor and preview side-by-side (default)
- **Editor Only** - Focus on editing
- **Preview Only** - Focus on formatted output

💡 **Tip**: Use `Ctrl+Shift+V` to quickly cycle through view modes!

#### Toolbar Buttons

**File Operations:**
- 💾 **Save** - Save your document (Ctrl+S)
- 📄 **Export HTML** - Export to HTML format
- 📑 **Export PDF** - Export to PDF (via HTML)

**Text Formatting:**
- **B** - Bold text (Ctrl+B)
- **I** - Italic text (Ctrl+I)
- **S** - Strikethrough
- **</>** - Inline code

**Headings:**
- **H1, H2, H3** - Insert heading levels

**Lists:**
- **• List** - Bullet list
- **1. List** - Numbered list
- **☑ Task** - Task/checkbox list (interactive - click to toggle in preview!)

**Insert:**
- 🔗 **Link** - Insert hyperlink (Ctrl+K)
- 🖼️ **Image** - Insert image
- 📊 **Table** - Insert table
- **{ } Code** - Code block

**View Controls:**
- 🔄 **Sync** - Toggle synchronized scrolling
- 📑 **TOC** - Toggle table of contents
- 🎯 **Focus** - Toggle focus mode (F11)

## Configuration

Access settings via: `File > Preferences > Settings` → Search for "Markdown Office"

### Page Appearance

#### Margins
**Setting:** `mdOfficeEditor.pageMargins`
- Default: 48px (0.5 inch)
- Range: 0-200px
- Controls the white space around your document

```json
"mdOfficeEditor.pageMargins": 48
```

#### Font Size
**Setting:** `mdOfficeEditor.fontSize`
- Default: 11pt
- Range: 8-24pt
- Adjust text size for readability

```json
"mdOfficeEditor.fontSize": 12
```

#### Font Family
**Setting:** `mdOfficeEditor.fontFamily`
- Options: Calibri, Times New Roman, Arial, Georgia, Courier New
- Choose your preferred typeface

```json
"mdOfficeEditor.fontFamily": "Times New Roman"
```

#### Line Height
**Setting:** `mdOfficeEditor.lineHeight`
- Default: 1.08 (single spacing)
- 1.5 for 1.5 spacing, 2.0 for double spacing
- Range: 1.0-3.0

```json
"mdOfficeEditor.lineHeight": 1.5
```

### View Settings

#### Default View Mode
**Setting:** `mdOfficeEditor.defaultViewMode`
- Options: split, editor, preview
- Sets how files open by default

```json
"mdOfficeEditor.defaultViewMode": "split"
```

#### Remember View Mode
**Setting:** `mdOfficeEditor.rememberViewMode`
- Default: true
- Remembers your last used view mode per workspace

```json
"mdOfficeEditor.rememberViewMode": true
```

#### Sync Scroll
**Setting:** `mdOfficeEditor.syncScroll`
- Default: true
- Synchronizes scrolling between editor and preview

```json
"mdOfficeEditor.syncScroll": true
```

### Theme

#### Document Theme
**Setting:** `mdOfficeEditor.documentTheme`
- Options: auto, light, dark
- **auto** - Matches VS Code theme
- **light** - Always white background
- **dark** - Always dark background

```json
"mdOfficeEditor.documentTheme": "auto"
```

### Productivity Features

#### Word Count Goal
**Setting:** `mdOfficeEditor.wordCountGoal`
- Default: 0 (disabled)
- Set a target word count
- Progress shown in status bar

```json
"mdOfficeEditor.wordCountGoal": 1000
```

Example status bar: `Words: 750 (75% of 1000)`

#### Reading Time
**Setting:** `mdOfficeEditor.showReadingTime`
- Default: true
- Shows estimated reading time
- Based on 225 words/minute

```json
"mdOfficeEditor.showReadingTime": true
```

Example status bar: `~5 min read`

### Export Settings

#### Paper Size
**Setting:** `mdOfficeEditor.export.paperSize`
- Options: Letter, A4, Legal
- Used for PDF exports

```json
"mdOfficeEditor.export.paperSize": "Letter"
```

#### Export Margins
**Setting:** `mdOfficeEditor.export.margins`
- Default: 48px
- Can differ from editor margins
- Applied to PDF/HTML exports

```json
"mdOfficeEditor.export.margins": 72
```

### Focus Mode

#### Hide Toolbar in Focus Mode
**Setting:** `mdOfficeEditor.focusMode.hideToolbar`
- Default: true
- Hides toolbar for distraction-free writing

```json
"mdOfficeEditor.focusMode.hideToolbar": true
```

#### Hide Status Bar in Focus Mode
**Setting:** `mdOfficeEditor.focusMode.hideStatusBar`
- Default: true
- Hides status bar in focus mode

```json
"mdOfficeEditor.focusMode.hideStatusBar": true
```

### Advanced

#### Custom CSS
**Setting:** `mdOfficeEditor.customCss`
- Path to a custom CSS file
- Override any styling

```json
"mdOfficeEditor.customCss": "/path/to/custom.css"
```

## Features in Detail

### Search with Highlighting

Find and navigate through text with visual highlighting across all views.

**Open Search:** Press `Ctrl+F` (or `Cmd+F` on Mac)

**Features:**
- ✅ **Visual Highlighting**: All matches shown in yellow
- ✅ **Current Match**: Highlighted in orange with outline
- ✅ **Auto-search**: Results appear as you type (min 2 characters)
- ✅ **Navigation**: Previous/Next buttons to move between matches
- ✅ **Dual View**: Works in both editor and preview simultaneously
- ✅ **Auto-scroll**: Automatically scrolls to current match
- ✅ **Live Update**: Highlights refresh as you edit

**Keyboard Shortcuts:**
- `Ctrl+F` - Open search dialog
- `Enter` - Next match
- `Shift+Enter` - Previous match
- `Esc` - Close search

**Visual Indicators:**
- Yellow background: All matches
- Orange background + outline: Current match
- Match counter: "Match X of Y"

**Use Cases:**
- Finding specific terms in long documents
- Reviewing all occurrences before editing
- Navigation through repeated elements
- Quality checking for consistency

### Synchronized Scrolling

When enabled (default), scrolling in the editor automatically scrolls the preview to the corresponding position, and vice versa.

**Toggle:** Click 🔄 Sync button in toolbar

**Use Cases:**
- Verify formatting while writing
- Navigate long documents easily
- Compare source and output

### Table of Contents

Automatically extracts all headings from your document and displays them in a navigable sidebar.

**Toggle:** Click 📑 TOC button in toolbar

**Features:**
- Click any heading to jump to that section
- Indented based on heading level (H1-H6)
- Updates in real-time as you edit
- Shows "No headings found" when empty

### Focus Mode

Remove distractions for concentrated writing.

**Activate:** 
- Click 🎯 Focus button
- Press F11

**What Happens:**
- Toolbar hides (if enabled in settings)
- Status bar hides (if enabled in settings)
- Full screen for content
- Exit hint appears briefly at top-right

**Exit:** 
- Press **Esc** (Escape key)
- Press **F11**
- A hint message appears briefly when entering focus mode to remind you

### Word Count Goals

Set a target word count to track your progress.

**Setup:**
1. Open Settings
2. Search "word count goal"
3. Set your target (e.g., 1000)

**Display:**
- Shows percentage in status bar
- Turns green and bold when reached
- Example: `Words: 1000 (100% of 1000) ✓`

### Dark Theme

Works seamlessly with VS Code's theme system.

**Auto Mode (Default):**
- Light document with light VS Code themes
- Dark document with dark VS Code themes

**Manual Override:**
- Set to "light" for always white background
- Set to "dark" for always dark background

**Dark Theme Includes:**
- Dark document background (#2d2d2d)
- Light text (#d4d4d4)
- Blue accent for headings
- Adjusted colors for code, tables, quotes

### Task Lists (Checklists)

Interactive checklists that update your markdown automatically.

**Creating Checklists:**
```markdown
- [ ] Unchecked task
- [x] Completed task
- [X] Also works with capital X
```

**Interactive Features:**
- ✅ Click checkboxes directly in the preview pane
- ✅ Changes automatically update the markdown source
- ✅ Full support for nested checklists
- ✅ Mix with regular lists and numbered lists

**Nested Example:**
```markdown
- [ ] Project Phase 1
  - [x] Task 1 completed
  - [ ] Task 2 in progress
    - [x] Subtask A
    - [ ] Subtask B
```

**Use Cases:**
- To-do lists and project planning
- Meeting notes with action items
- Documentation with implementation checklists
- Tutorial steps with progress tracking

### Nested Blockquotes

Multi-level blockquotes with visual distinction between levels.

**Creating Blockquotes:**
```markdown
> First level quote
>
> > Second level (nested)
> >
> > > Third level (deeply nested)
```

**Visual Styling:**
- Each nesting level has a different background shade
- Border color intensity varies by depth
- Proper indentation and spacing
- Works in both light and dark themes

**Real-World Example:**
```markdown
> **Warning:** This is important.
>
> > **Note:** Additional context here.
> >
> > > **Tip:** Even more detail at this level.
```

**Use Cases:**
- Email-style conversations and replies
- Documentation with nested notes and warnings
- Academic citations and references
- Multi-level commentary

### Table Alignment

Tables with proper header and content alignment, plus horizontal scrolling.

**Features:**
- ✅ Headers and content cells are perfectly aligned
- ✅ Wide tables scroll horizontally without breaking layout
- ✅ Support for alignment (left, center, right)
- ✅ Proper rendering with varying content lengths

**Alignment Syntax:**
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
```

**Benefits:**
- No misalignment between header and data columns
- Responsive design for narrow viewports
- Clean, professional table rendering

## Tips & Tricks

### 1. Quick View Switching
Use `Ctrl+Shift+V` to quickly cycle through view modes without using the mouse.

### 2. Optimal Writing Setup
- Enable focus mode (F11)
- Set word count goal
- Use split view initially, then switch to editor-only in focus mode

### 3. Large Documents
- Enable table of contents for navigation
- Use synchronized scrolling to verify formatting
- Set appropriate line height (1.5) for easier reading

### 4. Presentation Mode
- Switch to preview-only view
- Hide toolbar and status bar (focus mode settings)
- Adjust font size for screen sharing

### 5. Custom Styling
Create a `custom.css` file to:
- Add custom fonts
- Adjust heading colors
- Create custom themes
- Add print styles

Example `custom.css`:
```css
#editor {
    font-family: 'Georgia', serif;
}

#preview h1 {
    color: #ff6b6b;
    border-bottom: 2px solid #ff6b6b;
}

#preview {
    font-size: 12pt;
}
```

### 6. Export Workflow
1. Set export margins and paper size in settings
2. Write your document
3. Click Export PDF
4. Open in browser
5. Print > Save as PDF
6. Adjust print settings if needed

### 7. Productivity Tracking
Combine multiple features:
- Set word count goal
- Enable reading time estimate
- Track progress in status bar
- Focus mode when hitting writer's block

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save document |
| `Ctrl+B` | Bold selected text |
| `Ctrl+I` | Italic selected text |
| `Ctrl+K` | Insert link |
| `Ctrl+Shift+V` | Cycle view modes |
| `F11` | Toggle focus mode |

*Mac users: Replace `Ctrl` with `Cmd`*

## Troubleshooting

### Settings Not Applying
- Close and reopen the markdown file
- Settings are read when editor opens

### View Mode Not Remembered
- Check that `rememberViewMode` is enabled
- Setting is per-workspace

### Sync Scroll Not Working
- Ensure both panes are visible (split view)
- Check that sync scroll button is active (blue background)
- Try toggling sync scroll off and on

### Dark Theme Not Activating
- Check `documentTheme` setting
- If set to "auto", verify VS Code theme is dark
- Try setting to "dark" explicitly

### TOC Not Showing Headings
- Ensure headings use proper markdown syntax (`# Heading`)
- Headings must start at beginning of line
- Check for spaces between `#` and heading text

### Custom CSS Not Loading
- Verify file path is correct
- Use absolute path
- Check file permissions
- Reopen editor after changing setting

## Best Practices

### Document Structure
- Use H1 for document title
- Use H2 for main sections
- Use H3-H6 for subsections
- Enables effective TOC navigation

### Formatting
- Use consistent heading hierarchy
- Leave blank lines between sections
- Use lists for better readability
- Add alt text to images

### Writing Workflow
1. Start in split view for immediate feedback
2. Use editor-only when drafting
3. Switch to preview-only for review
4. Use focus mode for deep work

### Performance
- Disable sync scroll for very large documents
- Close TOC when not needed
- Use editor-only view for fastest typing

## Support

For issues, feature requests, or questions:
- Check this user guide
- Review IMPLEMENTATION_SUMMARY.md
- Check VS Code output console for errors
- Report issues with detailed description

Enjoy your enhanced markdown editing experience! 📝✨

