# Escape Sequences and Special Characters Test

This document tests various escape sequences and special character handling.

## Backslash Escapes

### Basic Markdown Characters

- Backslash: \\
- Backtick: \`
- Asterisk: \*
- Underscore: \_
- Curly braces: \{ \}
- Square brackets: \[ \]
- Angle brackets: \< \>
- Parentheses: \( \)
- Hash: \#
- Plus: \+
- Minus: \-
- Dot: \.
- Exclamation: \!
- Pipe: \|

### In Context

This should \*not\* be italic or bold: \*text\* and \*\*text\*\*

This should \[not\] be a link: \[text\]\(url\)

This should \# not be a header: \# Not a Header

## Code Blocks and Escaping

Inline code can contain special chars: `**not bold** *not italic* [not a link]`

Fenced code block:
```
No escaping needed here:
** This is not bold **
* This is not a bullet
# This is not a header
```

## Backslash Handling

Single backslash: \
Double backslash: \\
Triple backslash: \\\
Four backslashes: \\\\

Windows path: C:\\Users\\Documents\\file.txt
Linux path: /home/user/documents/file.txt
UNC path: \\\\server\\share\\folder\\

## Special Characters in Lists

- Item with \* asterisk
- Item with \_ underscore
- Item with \` backtick
- Item with \# hash
  - Nested with \* asterisk
  - Nested with \\ backslash

1. Numbered with \* asterisk
2. Numbered with \[ brackets \]
3. Numbered with \# hash

## Inline Code vs Escaping

Compare:
- Escaped: \*\*bold\*\*
- In code: `**bold**`
- Actual: **bold**

## HTML Entities and Special Symbols

| Entity | Display | Description |
|--------|---------|-------------|
| `&lt;` | &lt; | Less than |
| `&gt;` | &gt; | Greater than |
| `&amp;` | &amp; | Ampersand |
| `&quot;` | &quot; | Quotation mark |
| `&apos;` | &apos; | Apostrophe |
| `&nbsp;` | &nbsp; | Non-breaking space |
| `&copy;` | &copy; | Copyright |
| `&reg;` | &reg; | Registered |
| `&trade;` | &trade; | Trademark |

## URL Encoding

Normal URL: https://example.com/page?param=value&other=test

URL with spaces: https://example.com/page%20with%20spaces

URL with special chars: https://example.com/search?q=hello+world&filter=new

## Parentheses and Brackets

Regular: (text in parentheses) and [text in brackets]

Escaped: \(not italic\) and \[not a reference\]

Mixed: (some **bold** text) and [some *italic* text]

Nested: ((double parentheses)) and [[double brackets]]

## Underscores and Emphasis

Regular emphasis: _italic_ and __bold__

With escaping: \_not italic\_ and \_\_not bold\_\_

In code: `_variable_name` and `__private_method`

## Complex Escaping Scenarios

### Mixed Escaping

Normal **bold** vs escaped \*\*not bold\*\*

Normal *italic* vs escaped \*not italic\*

Normal `code` vs \`not code\`

### Backslash Before Special Syntax

Backslash before link: \[text\](url)

Backslash before image: \!\[alt\](src)

Backslash before code: \`\`\`not a code block\`\`\`

### Multiple Levels

\\*nested escaping*\\ - which parts render?

\*\*\\*triple layer\\\*\*\* - test parsing

## Regular Expressions in Code

Regex patterns need careful handling:

- `\d+` - matches digits
- `\w*` - matches word characters
- `\.` - matches literal dot
- `[a-z]+` - character class
- `(group)` - capturing group
- `^start` and `end$` - anchors

In text: The pattern \d+ matches one or more digits.

## Quotation Marks

Straight quotes: "double" and 'single'

Curly quotes: "double" and 'single'

Backticks: `code quotes`

Mixed: "She said, 'Hello' to me"

## Dashes and Hyphens

Hyphen: -
En dash: –
Em dash: —
Minus: −

In context: This is a hyphen-separated-word.

Date range: 2020–2023

Parenthetical thought—like this—uses em dash.

## Ampersands

In text: Tom & Jerry, Research & Development

In code: `if (x && y)` or `SELECT * FROM table WHERE a & b`

Escaped: \&

HTML entity: &amp;

## Angle Brackets and Comparison

Math: 5 < 10 and 20 > 15

HTML-like: \<tag\> or <tag>

Generic: List\<String\> in Java

Comparison operators: `if (x < y && y > z)`

## Edge Cases with Escaping

Empty escape: \ (backslash at end)

Double escape: \\ becomes single \

Escape before nothing special: \a \b \c

Escape in URL: `https://example.com/path\?param`

Mixed: **bold with \* escaped asterisk** inside

## Unicode and Emoji

Emoji: 🎉 😀 ✅ ❌ 🚀

Math symbols: ∑ ∫ √ ∞ ≠ ≤ ≥

Arrows: → ← ↑ ↓ ↔ ⇒

Shapes: ★ ☆ ○ ● ◆ ◇ ■ □

Currency: $ € £ ¥ ₹ ₽ ₿

## Zero-Width and Invisible Characters

Normal: text with spaces

With ZWSP: text​with​zero​width​spaces (might not be visible)

With NBSP: text with non-breaking spaces



