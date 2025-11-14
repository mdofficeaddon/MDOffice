# MDOffice Test Files

## Overview

Test files organized by feature category. Each test category contains both the Markdown source (`.md`) and HTML output (`.html`) files together.

## Directory Structure

```
tests/
├── blockquotes/                 # Blockquote rendering tests
├── checklists/                  # Checkbox functionality tests
├── edge-cases/                  # Parser edge cases
├── formatting/                  # Text formatting tests
├── images/                      # Image rendering tests
├── links/                       # Link rendering tests
├── lists/                       # List structure tests
├── math/                        # LaTeX math expression tests
├── samples/                     # General sample files
├── tables/                      # Table rendering tests
├── docs/                        # Documentation
└── README.md                    # This file
```

## Test Categories

| Category | Files | Purpose |
|----------|-------|---------|
| **blockquotes/** | 1 test | Blockquote rendering |
| **checklists/** | 3 tests | Checkbox functionality & export |
| **edge-cases/** | 2 tests | Parser edge cases |
| **formatting/** | 2 tests | Text formatting & escape sequences |
| **images/** | 1 test | Image rendering & variations |
| **links/** | 1 test | Link types & URL variations |
| **lists/** | 4 tests | List structures & nesting |
| **math/** | 1 test | LaTeX math expressions |
| **samples/** | 1 test | General demonstration |
| **tables/** | 2 tests | Table rendering |

**Total: 18 markdown files + 17 HTML output files**

## File Naming Convention

Each test uses this naming convention:
- **Markdown Source**: `test-<name>.md`
- **HTML Output**: `test-<name>.html` (direct output of the markdown file)

Both files are stored together in the same category directory.

## Quick Navigation

### Lists Tests
```
lists/
├── test-deep-nesting.md/html
├── test-edge-cases-nesting.md/html
├── test-nested-lists-showcase.md
└── test-proper-nesting.md/html
```

### Formatting Tests
```
formatting/
├── test-escape-sequences.md/html
└── test-formatting-stress.md/html
```

### Tables Tests
```
tables/
├── test-tables.md/html
└── test-tables-special-chars.md/html
```

### Checklists Tests
```
checklists/
├── test-checkbox-transformation.md/html
├── test-checklist-export.md/html
└── test-checklists.md/html
```

### Other Tests
```
blockquotes/
└── test-blockquotes.md/html

edge-cases/
├── test-escape-sequences.md/html
└── test-parser-breakers.md/html

images/
└── test-images.md/html

links/
└── test-links.md/html

math/
└── test-math-latex.md/html

samples/
└── test-sample.md/html
```

## Usage

### View a test
```powershell
# Open a test markdown file
code tests/lists/test-deep-nesting.md
```

### Run tests for a category
```powershell
# Get all markdown files in a category
Get-ChildItem tests/lists/*.md
```

### Add a new test
1. Create your markdown file in the appropriate category: `tests/<category>/test-<name>.md`
2. Generate the corresponding HTML output: `tests/<category>/test-<name>.html`
3. Done! Files are already organized by category

## Benefits

✅ **Simple & Flat**: Direct access to test categories - no deep nesting

✅ **Paired Files**: `.md` and `.html` outputs stay together in the same directory

✅ **Easy to Find**: Tests grouped by feature type

✅ **Maintainable**: Clear structure for adding/updating tests

✅ **Scalable**: Easy to add new test categories as needed

---

For detailed documentation, see `docs/README.md`
