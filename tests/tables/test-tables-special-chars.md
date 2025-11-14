# Tables with Special Characters Test

This document tests various special characters in markdown tables.

## Basic Table with Dollar Signs

| Item | Price | Quantity | Total |
|------|-------|----------|-------|
| Apple | $2.50 | 3 | $7.50 |
| Banana | $1.25 | 5 | $6.25 |
| Orange | $3.00 | 2 | $6.00 |
| **Total** | - | **10** | **$19.75** |

## Table with Pipe Characters (Escaped)

| Column A | Column B | Column C |
|----------|----------|----------|
| Normal text | Text with \| pipe | More text |
| Option 1 \| Option 2 | Value | Description |
| `code \| with pipe` | *italic* | **bold** |

## Table with Backslashes and Special Chars

| Path | Description | Size |
|------|-------------|------|
| C:\\Users\\Documents\\ | Windows path | 1.5GB |
| /home/user/docs/ | Linux path | 2.3GB |
| \\\\server\\share\\ | Network path | 500MB |

## Table with Markdown Formatting

| **Header 1** | *Header 2* | ~~Header 3~~ |
|--------------|------------|--------------|
| **Bold text** | *Italic text* | ~~Strikethrough~~ |
| `code snippet` | [Link](https://example.com) | ![img](https://via.placeholder.com/20) |
| ***Bold+Italic*** | `inline code` | Normal |

## Table with Code and Backticks

| Function | Syntax | Example |
|----------|--------|---------|
| Print | `print()` | `print("Hello")` |
| Variable | `var x = 5` | `let name = "John"` |
| Comment | `// comment` | `# Python comment` |

## Table with Currency Symbols

| Currency | Symbol | Example |
|----------|--------|---------|
| US Dollar | $ | $100.00 |
| Euro | € | €85.50 |
| British Pound | £ | £75.25 |
| Japanese Yen | ¥ | ¥10,000 |
| Bitcoin | ₿ | ₿0.0025 |

## Table with Percentage and Math Symbols

| Operation | Symbol | Result |
|-----------|--------|--------|
| Addition | 5 + 3 | 8 |
| Subtraction | 10 - 4 | 6 |
| Multiplication | 6 × 7 | 42 |
| Division | 20 ÷ 4 | 5 |
| Percentage | 25% | 0.25 |
| Greater than | 10 > 5 | true |
| Less than | 3 < 7 | true |
| Equals | 2 + 2 = 4 | true |

## Table with HTML Entities

| Entity | Code | Display |
|--------|------|---------|
| Less than | `&lt;` | &lt; |
| Greater than | `&gt;` | &gt; |
| Ampersand | `&amp;` | &amp; |
| Quote | `&quot;` | &quot; |
| Non-breaking space | `&nbsp;` | &nbsp; |

## Table with Emoji and Unicode

| Category | Example | Description |
|----------|---------|-------------|
| Emoji | 😀 🎉 ✅ | Happy, celebration, check |
| Arrows | → ← ↑ ↓ | Direction arrows |
| Math | ∑ ∫ √ ∞ | Sum, integral, root, infinity |
| Symbols | © ® ™ § | Copyright, registered, trademark |

## Table with Mixed Alignment

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| $10.00 | $20.00 | $30.00 |
| Text left | Text center | Text right |
| 100 | 200 | 300 |

## Complex Table with Nested Formatting

| Feature | Code Example | Price | Status |
|---------|--------------|-------|--------|
| **Bold API** | `**text**` | $0.00/mo | ✅ Free |
| *Italic Pro* | `*text*` | $9.99/mo | 🚧 Beta |
| `Code Block` | `` `code` `` | $19.99/mo | ✅ Live |
| ~~Deprecated~~ | `~~text~~` | ~~$5.00/mo~~ | ❌ Removed |

## Table with Long Text and Wrapping

| ID | Description | Notes |
|----|-------------|-------|
| 001 | This is a very long description that might wrap in the table cell depending on the renderer settings | Additional notes here |
| 002 | Short | Simple note |
| 003 | Multiple $100 transactions: $25.50 + $35.75 + $38.75 = $100.00 | Check accounting |

## Edge Case: Empty Cells and Special Patterns

| A | B | C | D |
|---|---|---|---|
| $ | $$ | $$$ | $$$$ |
| | Empty | | Mixed |
| \| | \|\| | \|\|\| | Pipes |
| `$` | `$$` | Text | $100 |

## Table with Scientific Notation

| Value | Scientific | Description |
|-------|------------|-------------|
| 1,000,000 | 1.0 × 10^6 | One million |
| 0.000001 | 1.0 × 10^-6 | One millionth |
| 6.022 × 10^23 | - | Avogadro's number |
| $1.5 × 10^3 | - | $1,500 |



