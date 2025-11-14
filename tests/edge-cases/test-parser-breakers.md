# Parser Breakers and Ambiguous Syntax

This document contains edge cases that might break or confuse markdown parsers.

## Ambiguous Emphasis

Asterisk vs emphasis:
- 2 * 3 = 6 (math)
- 2*3=6 (still math?)
- *2 * 3* = 6 (italic with asterisk?)
- *text* (italic)

Underscore vs emphasis:
- snake_case_variable (code convention)
- file_name_example (code convention)
- _italic text_ (emphasis)
- __bold text__ (emphasis)
- some_text_with_underscores_and_more (mixed)
- _this_might_be_confusing_ (italic or code?)

## Consecutive Formatting Markers

**Bold****More bold**

**Bold** **More bold**

*Italic**Italic*

___

***

---

*_*_*

**__**__**

## Unmatched Delimiters

**Bold with *italic inside*

*Italic with **bold inside**

**Bold with `code inside`

`Code with **bold attempt** inside`

[Link with **bold](https://example.com)**

![Image with *italic](https://example.com)*

## Nested Same-Type Emphasis

**Bold **nested bold** outer**

*Italic *nested italic* outer*

~~Strike ~~nested strike~~ outer~~

`Code `nested code` outer`

## Backtick Variations

Single: `code`

Double: ``code with `backtick` inside``

Triple: ```code```

Mismatched: `code``

Empty: ``

Space: ` `

## Link Edge Cases

[](https://example.com) - Empty text

[Link]() - Empty URL

[]() - Empty both

[Link](url with spaces)

[Link](url(with)parens)

[Link](<url with angle brackets>)

[Link][ref] - Missing reference

[Link]

[Link][] - Self reference

## Image Edge Cases

![](image.jpg) - Empty alt

![Alt text]() - Empty src

![]() - Empty both

![Alt](img.jpg "Title with "quotes" inside")

![Alt](<img.jpg>) - Angle brackets

## Table Edge Cases

| A | B | C
|---|---|---
| 1 | 2 | 3

Missing closing pipe:

| A | B | C |
|---|---|---|
| 1 | 2 | 3

| A | B | C

Misaligned columns:

| A | B | C |
|---|---|---|
| 1 | 2 |
| 1 | 2 | 3 | 4 |

Empty cells everywhere:

| | | |
|-|-|-|
| | | |

## Code Block Edge Cases

Missing closing:

```javascript
function test() {
    console.log("No closing fence");
}

Empty language:

```
code without language
```

Invalid language:

```not-a-real-language
some code
```

Nested fences:

```
Outer
```
Inner
```
Still outer?
```

## Blockquote Edge Cases

> Quote without closing

> Quote
> > Nested
Missing return

> Quote with
blank line

Quote

>No space after >

>     Code block in blockquote?

## List Edge Cases

- Item
-Missing space
- Item

* Mixed
- bullet
+ types

1. Numbered
2. List
5. Wrong number
2. Another wrong

1) Alternative
2) Parenthesis
3) Style

-1. Negative number?

0. Zero start

## Header Edge Cases

#No space after hash

# Header with trailing #

####### Too many hashes (level 7?)

# **Bold Header** with *italic* and `code` and [link](url) #

Header without space
===

Header-with-dashes
---

## Mixed Line Break Styles

Line 1  
Line 2 (two spaces)

Line 3

Line 4 (blank line)

Line 5<br>
Line 6 (HTML break)

Line 7\
Line 8 (backslash, if supported)

## Dollar Sign Confusion

Price is $100 and $200 = $300 total

Math: $x = 5$ and $y = 10$ so $x + y = 15$

Mixed: The item costs $50 (price) and formula is $p = 50$ (math)

Escaped: \$100 is the price, not $100$ in math

Double dollar:

$$
x = \frac{1}{2}
$$

Inline double: $$x = 5$$ (might not work)

Triple: $$$weird$$$

Mismatched: $x = 5$$

$Unclosed math

## HTML vs Markdown

<b>HTML bold</b> vs **Markdown bold**

<i>HTML italic</i> vs *Markdown italic*

<code>HTML code</code> vs `Markdown code`

<strike>HTML strike</strike> vs ~~Markdown strike~~

<p>HTML paragraph</p>

Markdown paragraph

Mixed: <b>HTML **with Markdown** inside</b>

Mixed: **Markdown <i>with HTML</i> inside**

## Comment Edge Cases

<!-- HTML comment -->

<!-- Comment with **markdown** inside? -->

<!--
Multi-line
comment
with
content
-->

Not a comment: <! not valid >

## URL Auto-linking

https://example.com - bare URL

http://example.com - bare HTTP

www.example.com - bare www

<https://example.com> - angle brackets

[https://example.com](https://example.com) - explicit link

email@example.com - bare email

<email@example.com> - angle brackets

## Reference Definitions Edge Cases

[ref1]: https://example.com

[ref2]: https://example.com "Title"

[ref3]: https://example.com (Title with parens)

[ref4]: <https://example.com>

[ref 5]: https://example.com "Reference with space"

## Character Encoding Issues

Regular quotes: "text"

Smart quotes: "text"

Apostrophes: don't vs don't

Ellipsis: ... vs …

Dashes: - vs – vs —

## Zero-Width and Special Spaces

Text with regular space

Text with   multiple   spaces

Text​with​zero​width​spaces (invisible)

Text with non-breaking spaces (might look normal)

Textwithoutspaces

## Extreme Nesting

- Level 1
  - Level 2
    - Level 3
      - Level 4
        - Level 5
          - Level 6
            - Level 7
              - Level 8
                - Level 9
                  - Level 10
                    - Level 11
                      - Level 12
                        - Level 13
                          - Level 14
                            - Level 15

> Level 1
> > Level 2
> > > Level 3
> > > > Level 4
> > > > > Level 5
> > > > > > Level 6
> > > > > > > Level 7
> > > > > > > > Level 8
> > > > > > > > > Level 9
> > > > > > > > > > Level 10

## Overlapping Formatting

**Bold *and italic** still italic?*

*Italic **and bold* still bold?**

**Bold ~~and strike** still strike?~~

~~Strike **and bold~~ still bold?**

## Malformed Tables

| No | Separator | Row |
| A | B | C |

| Separator | Before | Header |
|-----------|--------|--------|
| A | B | C |

| Col1 | Col2 |
|------|
| Missing separator |

| Col |
|-----|-----|
| Too many separators |

## Unicode Edge Cases

RTL text: مرحبا (Arabic)

Mixed: Hello مرحبا World

Emoji: Text 😀 with 🎉 emoji 🚀 inline

Combining: e + ´ = é (combining accent)

## Backslash at Line End

Line with backslash at end\
Does it continue?

Line with escaped backslash at end\\
What happens?

## Empty Structures

****

____

****

[]()

![]()

``

```
```

>

-

|

##

---

***

## Very Long Word

Supercalifragilisticexpialidociousthisisaverylongwordthatmightcauselayoutissuesinsomerenderersespeciallyiftherearenospacestobreakonsothisisatestofthatscenariowithareallyreallyreallylongwordthatjustkeepsgoing

## Mixed List Markers Same Level

- Bullet 1
* Bullet 2
+ Bullet 3
- Bullet 4

## Numbers with Formatting

**$100** in bold

*€50* in italic

`¥1000` in code

~~$25~~ strike price

## Adjacent Code Blocks

```javascript
Block 1
```
```python
Block 2
```

No space between them.

## Multiple Separators

| Header 1 | Header 2 | Header 3 |
|:---------|:--------:|---------:|
|----------|----------|----------|
| Left | Center | Right |

## Formatting in Links

[**Bold link text**](url)

[*Italic link text*](url)

[`Code link text`](url)

[~~Strike link text~~](url)

[***All formatting***](url)

[Text with $math$](url)

## End of Parser Breakers

These edge cases should help identify parser weaknesses!



