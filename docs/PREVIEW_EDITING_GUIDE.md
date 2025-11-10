# Preview Editing Feature Guide

## Overview

The Markdown Office Editor now supports **full editing capabilities in Preview mode**! You can edit your documents directly in the rendered preview view with all formatting features available.

## Key Features

### 1. **Contenteditable Preview**
When you switch to "Preview Only" mode, the preview pane becomes fully editable, just like a word processor.

### 2. **Bidirectional Sync**
- Changes made in preview mode are automatically converted back to markdown
- The underlying markdown source is updated in real-time
- Switch between modes seamlessly without losing edits

### 3. **Full Toolbar Support**
All toolbar buttons work in preview mode:
- **Bold**, *Italic*, ~~Strikethrough~~, `Inline Code`
- Headings (H1, H2, H3)
- Lists (Bullet, Numbered, Task)
- Insert Links, Images, Tables, Code Blocks
- All other formatting options

### 4. **Keyboard Shortcuts**
All keyboard shortcuts work in preview mode:
- `Ctrl+B` / `Cmd+B` - Bold
- `Ctrl+I` / `Cmd+I` - Italic
- `Ctrl+K` / `Cmd+K` - Insert Link
- `Ctrl+F` / `Cmd+F` - Search
- `Ctrl+S` / `Cmd+S` - Save
- `F11` - Toggle Focus Mode
- `Esc` - Exit Focus Mode

### 5. **HTML to Markdown Conversion**
The editor intelligently converts your edits back to markdown format, supporting:
- Headings (H1-H6)
- Text formatting (bold, italic, strikethrough)
- Links and images
- Lists (ordered, unordered, task lists with checkboxes)
- Code blocks and inline code
- Tables
- Blockquotes
- Horizontal rules

## How to Use

### Basic Editing

1. **Switch to Preview Mode**
   - Use the dropdown menu in the toolbar
   - Select "Preview Only"
   - The preview pane automatically becomes editable

2. **Start Editing**
   - Click anywhere in the preview to place your cursor
   - Type to add or modify text
   - Select text and use toolbar buttons or keyboard shortcuts

3. **Return to Editor Mode**
   - Switch back to "Split View" or "Editor Only"
   - Your changes are preserved in the markdown source

### Using Toolbar Buttons

In preview mode, toolbar buttons work intelligently:
- **Selection-based**: If you select text, formatting is applied to the selection
- **Insertion-based**: If no text is selected, formatting markers are inserted at the cursor

Example workflow:
1. Type some text: "This is important"
2. Select "important"
3. Click the **Bold** button
4. Result: "This is **important**"

### Advanced Features

#### Direct Typing
You can type directly in preview mode just like in a word processor. The text is automatically converted to markdown format.

#### Copy and Paste
Paste formatted text from other applications. The editor will attempt to preserve the formatting and convert it to markdown.

#### Rich Content Editing
Edit complex structures like tables, lists, and blockquotes visually in the preview, and the markdown source is updated accordingly.

## Technical Details

### Conversion Logic

The editor uses a sophisticated HTML-to-Markdown conversion system:

1. **Real-time Sync**: Changes are debounced (500ms) to avoid performance issues
2. **Structure Preservation**: Complex nested structures (lists, blockquotes) are properly maintained
3. **Clean Output**: Unnecessary HTML artifacts are stripped, producing clean markdown

### Supported Elements

| Element | Markdown Output | Notes |
|---------|----------------|--------|
| Headings | `# H1` to `###### H6` | All levels supported |
| Bold | `**text**` | Converts `<strong>` and `<b>` |
| Italic | `*text*` | Converts `<em>` and `<i>` |
| Strikethrough | `~~text~~` | Converts `<del>` and `<s>` |
| Links | `[text](url)` | Preserves URLs |
| Images | `![alt](src)` | Preserves alt text |
| Code Inline | `` `code` `` | Single backticks |
| Code Block | ` ```code``` ` | Triple backticks |
| Lists | `- item` or `1. item` | Nested lists supported |
| Tasks | `- [ ] task` | Checkboxes preserved |
| Tables | Pipe syntax | Full table support |
| Blockquotes | `> quote` | Nested quotes supported |

### Limitations

While the preview editing is powerful, there are some considerations:

1. **Complex Markdown**: Some advanced markdown features (e.g., footnotes, definition lists) may not round-trip perfectly
2. **Custom HTML**: Raw HTML in markdown is converted to its markdown equivalent when possible
3. **Formatting Loss**: Some visual formatting that doesn't have markdown equivalents will be lost

## Best Practices

### When to Use Preview Editing

**✓ Best for:**
- Visual editing of content
- Quick formatting changes
- Editing complex tables
- Working with lists and nested structures
- WYSIWYG editing experience

**✗ Less ideal for:**
- Precise markdown syntax control
- Working with raw HTML
- Advanced markdown features
- Debugging markdown issues

### Workflow Tips

1. **Mixed Mode**: Use split view to see both markdown and preview simultaneously
2. **Preview Polish**: Switch to preview mode for final formatting touches
3. **Quick Edits**: Use preview mode for fast visual edits without thinking about syntax
4. **Markdown Precision**: Switch to editor mode when you need precise control over syntax

## Troubleshooting

### Changes Not Syncing
- **Check mode**: Ensure you're in "Preview Only" mode
- **Wait for sync**: Changes are debounced for 500ms
- **Save**: Use Ctrl+S to force save

### Formatting Issues
- **Complex structures**: Try editing in split view to see both sides
- **Markdown syntax**: Switch to editor mode to fix manually
- **Refresh preview**: Toggle view modes to refresh the preview

### Performance
- **Large documents**: Preview editing works best with documents under 10,000 words
- **Slow sync**: The 500ms debounce prevents lag - wait for sync to complete

## Examples

### Example 1: Quick Formatting

**Task**: Make a word bold
1. Switch to Preview Only
2. Double-click the word to select it
3. Press `Ctrl+B` or click Bold button
4. Done! The markdown source now has `**word**`

### Example 2: Creating a List

**Task**: Add a bullet list
1. Switch to Preview Only  
2. Click where you want the list
3. Press the "• List" button
4. Type your first item and press Enter
5. Continue adding items

### Example 3: Table Editing

**Task**: Edit a table cell
1. Switch to Preview Only
2. Click in the cell you want to edit
3. Type your changes
4. The markdown table is automatically updated

## Conclusion

Preview editing brings WYSIWYG convenience to markdown editing while maintaining the power and simplicity of markdown format. It's perfect for users who want visual editing without sacrificing markdown's portability and version control friendliness.

Experiment with the feature and find the workflow that works best for you!

