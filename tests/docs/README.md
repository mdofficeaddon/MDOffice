# Test Files Documentation

Comprehensive documentation for MDOffice test files organization and usage.

## Directory Structure

```
tests/
├── blockquotes/              Test files for blockquote rendering
├── checklists/               Test files for checkbox functionality
├── edge-cases/               Test files for parser edge cases
├── formatting/               Test files for text formatting
├── lists/                    Test files for list structures
├── math/                     Test files for LaTeX math expressions
├── samples/                  General sample test files
├── tables/                   Test files for table rendering
├── docs/                     Documentation (this directory)
└── README.md                 Quick reference guide
```

## Test Organization

Each test category directory contains:
- **`.md` files**: Markdown source files
- **`.html` files**: HTML output files (generated from the markdown)

Both are stored in the same directory for easy access and management.

## Test Categories Explained

### 📋 Lists (`lists/`)
Tests for various list structures, nesting scenarios, and edge cases.

**Files:**
- `test-nested-lists-showcase.md` - Demonstrates nested bullet and numbered lists
- `test-proper-nesting.md/html` - Tests correct nesting behavior
- `test-edge-cases-nesting.md/html` - Tests edge cases in nested structures
- `test-deep-nesting.md/html` - Tests deeply nested list hierarchies

### 🎨 Formatting (`formatting/`)
Tests for text formatting options and escape sequence handling.

**Files:**
- `test-formatting-stress.md/html` - Stress tests for various formatting combinations (bold, italic, strikethrough, code, etc.)
- `test-escape-sequences.md/html` - Tests proper handling of escape sequences

### 📊 Tables (`tables/`)
Tests for table rendering and special character handling within tables.

**Files:**
- `test-tables.md/html` - Basic table rendering and structure tests
- `test-tables-special-chars.md/html` - Tests tables containing special characters

### ✅ Checklists (`checklists/`)
Tests for checkbox functionality and checklist-specific features.

**Files:**
- `test-checklists.md/html` - Basic checkbox rendering and toggling
- `test-checkbox-transformation.md/html` - Tests checkbox state transformations
- `test-checklist-export.md/html` - Tests checklist export functionality

### 💬 Blockquotes (`blockquotes/`)
Tests for blockquote rendering and nested blockquote structures.

**Files:**
- `test-blockquotes.md/html` - Basic and nested blockquote tests

### ∑ Math (`math/`)
Tests for LaTeX and mathematical expressions rendering.

**Files:**
- `test-math-latex.md/html` - Tests LaTeX math expression rendering and display

### ⚠️ Edge Cases (`edge-cases/`)
Tests for unusual scenarios and potential parser breaking points.

**Files:**
- `test-parser-breakers.md/html` - Tests scenarios that might break the parser
- `test-escape-sequences.md/html` - Edge cases in escape sequence handling

### 📝 Samples (`samples/`)
General sample files for demonstration and basic testing.

**Files:**
- `test-sample.md/html` - General sample markdown file showcasing various features

## Working with Tests

### Opening a Test

```powershell
# Navigate to tests directory
cd tests

# Open a specific test
code lists/test-deep-nesting.md
code checklists/test-checklists.md
```

### Running Category Tests

```powershell
# List all markdown files in a category
Get-ChildItem lists/*.md
Get-ChildItem formatting/*.md
Get-ChildItem tables/*.md
```

### Creating a New Test

1. **Identify the category** - Which feature is your test for?
2. **Create the markdown file** in the appropriate category:
   ```
   tests/<category>/test-<your-test-name>.md
   ```
3. **Generate the HTML output** (using your testing/export tool):
   ```
   tests/<category>/test-<your-test-name>.html
   ```
4. **Done!** Files are automatically organized

### Updating an Existing Test

1. Modify the `.md` file
2. Regenerate the `.html` file
3. Both stay synchronized in the same directory

## File Naming Convention

- **Pattern**: `test-<descriptive-name>.md` and `test-<descriptive-name>.html`
- **Examples**:
  - `test-deep-nesting.md` - Describes the test purpose
  - `test-checkbox-transformation.md` - Clear and descriptive
  - `test-math-latex.md` - Indicates what's being tested

## Best Practices

✅ **Always keep pairs together** - `.md` and `.html` files belong in the same directory

✅ **Use descriptive names** - File names should indicate what's being tested

✅ **Choose the right category** - Place tests in the most appropriate category

✅ **Create new categories if needed** - If a test doesn't fit existing categories, create one

✅ **Update this documentation** - Document new categories when created

❌ **Don't** mix source and output files in different directories

❌ **Don't** create deeply nested structures - keep it flat and simple

## Adding a New Test Category

If your test doesn't fit existing categories:

1. Create a new directory in `tests/`:
   ```powershell
   New-Item -ItemType Directory -Path tests/<new-category>
   ```

2. Add your test files:
   ```
   tests/<new-category>/test-<name>.md
   tests/<new-category>/test-<name>.html
   ```

3. Update `tests/README.md` and this file with the new category

## Summary

The flattened structure keeps everything simple and accessible:

- 📁 One level of directories under `tests/`
- 📄 Paired `.md` and `.html` files in the same folder
- 🏷️ Clear categorization by feature
- 🚀 Easy to navigate and manage

This approach balances organization with simplicity!
