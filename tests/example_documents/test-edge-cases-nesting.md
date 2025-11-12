- # Edge Cases and Complex Nesting Test

This document tests complex nesting, edge cases, and unusual markdown structures.

test

test

## Deeply Nested Lists

1. Level 1 - First item

1. - Level 2 - Bullet under first

- - Level 3 - Nested bullet

- - Level 4 - Even deeper

- - Level 5 - Very deep

- - Level 6 - Maximum nesting?

- - Level 7 - Still going

1. - Level 2 - Back to bullets

- 1. Level 3 - Numbered list

1. - Level 4 - Mixed types

- 1. Level 5 - Numbered again

1. - [ ] Level 6 - Task list

1. Level 1 - Second item

1. - [ ] Task item

1. - [x] Completed task

- - [ ] Nested task

- - [x] Deeply nested completed

## Complex Mixed Lists

- **Bold item** with *italic* and `code`

- 1. Numbered sub-item with ~~strikethrough~~

1. - [x] Completed task with [link](https://example.com)

       > And a blockquote!

- Another level with **formatting**

- Item with multiple paragraphs

  
  Second paragraph in list item.
  
  Third paragraph in list item.
  

- Item with code block:

  
  

```

javascript
  function nested() {
      return "code in list";
  }
  

```

## Nested Blockquotes

> Level 1 blockquote

> > Level 2 nested blockquote

> > > Level 3 triple nested

> > > > Level 4 quadruple nested!

> > Back to level 2

> Back to level 1

> Blockquote with **formatting**
> - And a list
> - Second item
> - Nested in blockquote

> And `code` too!

## Lists Inside Blockquotes

> This is a blockquote containing:
> 1. First item
> 2. Second item
> - Nested bullet
> - Another bullet
> 3. Third item

> And more text after the list.

## Blockquotes Inside Lists

1. First item

   
   > Blockquote inside list item
   > With multiple lines
   

1. Second item

   
   > Another blockquote
   > > With nesting!

## Code Blocks in Lists

1. Install the package:

   
   

```

bash
   npm install package-name
   

```

   

1. Import it in your code:

   
   

```

javascript
   import { something } from 'package-name';
   

```

   

1. Use it:

   
   

```

javascript
   const result = something();
   console.log(result);
   

```

## Tables with Complex Content

| Column 1 | Column 2 | Column 3 |
| --- | --- | --- |
| **Bold** | *Italic* | `Code` |
| [Link](https://example.com) | ~~Strike~~ | ***Bold+Italic*** |
| List:<br>- Item 1<br>- Item 2 | Quote:<br>> Quote text | Code:<br>`inline` |
| $\alpha$ | $\beta$ | $\gamma$ |

## Empty and Edge Case Content

Empty list item:

- 

- Item after empty

-

- Another empty edge

Empty code block:

```

```

Empty blockquote:

> After empty line

## Multiple Horizontal Rules

---

***
_*****
*
---

## Headers with Formatting

*****# ***Header with **bold** and *italic* and `code`******

*
*
*
*
*
*
## Header with [link](https://example.com) inside

### Header with ~~strikethrough~~ text

#### Header with $math$ expression

##### Header with emoji 🚀 and symbols

*###### *All **formatting** *types* `together` [link](url) ~~strike~~ $x$*
*
## Alternative Header Syntax

Header Level 1 Alternative
===========================

Header Level 2 Alternative
---------------------------

## Links with Complex URLs

[Link with spaces](https://example.com/path%20with%20spaces)
[Link with params](https://example.com/page?param1=value1&param2=value2&param3=value3)
[Link with anchor](https://example.com/page#section-name)
[Link with parens](https://en.wikipedia.org/wiki/Markdown</em>(language))
[Link with escaped chars](https://example.com/path\(with\)special)
## Images with Alt Text and Titles

![Simple image](https://via.placeholder.com/300)

![Image with title](https://via.placeholder.com/300 )

![Complex alt text with **formatting**](https://via.placeholder.com/300)

[![Image as link</a>](https://example.com)
## Reference-Style Links and Images

This is [a reference link][ref1] and [another one][ref2].

Here's an image: ![alt text][img1]

[ref1]: https://example.com "Optional Title"
[ref2]: https://example.com/page
[img1]: https://via.placeholder.com/200 "Image Title"

## Inline HTML (if supported)

<div style="border: 1px solid red; padding: 10px;">
This is HTML content mixed with **markdown formatting**.
</div>

<details>
<summary>Click to expand</summary>

**](https://via.placeholder.com/150)*[*Hidden content here with *markdown* support.****
*
*
*
*
*

- List item 1

*
- List item 2

</details>

## Definitions Lists (if supported)

Term 1
:   Definition of term 1

Term 2
:   First definition of term 2
:   Second definition of term 2

## Footnotes (if supported)

Here's a sentence with a footnote.[^1]

Another sentence with another footnote.[^note]

[^1]: This is the first footnote.
[^note]: This is another footnote with more details.

## Task Lists with Complex Content

- [ ] Simple task

- [x] Task with **bold** text

- [ ] Task with `code` inline

*](https://via.placeholder.com/150)*- [
](https://via.placeholder.com/150)
- [x] [ Task with ](https://via.placeholder.com/150)[link](https://example.com)

- - [ ] Nested task

- - [x] Completed nested task

- - [ ] Even deeper nesting

- [ ] Task with multiple lines

  that continues here
  and here too

## Emphasis Edge Cases

**bold text with *italic* inside**
*italic text with **bold** inside*
***bold and italic together***
**bold with `code` inside**
*italic with [link](url) inside*
~~strikethrough with **bold** inside~~
*
## *Mixed Line Breaks*

*
Line 1  
Line 2 with two spaces
Line 3
Line 4 with blank line above
Line 5<br>Line 6 with HTML break
## Very Long Lines

**This is a very long line that might cause wrapping issues depending on the renderer settings and viewport width. It contains **bold text**, *italic text*, `code snippets`, [links](https://example.com), and continues for quite a while to test how the renderer handles extremely long content that doesn't have natural break points and might need to wrap at unusual places or cause horizontal scrolling in some viewers.*
*
## Special Link Cases

[Link with **bold** text](https://example.com)
[Link with `code` text](https://example.com)
**[Bold link](https://example.com)**
*[Italic link](https://example.com)*
`[Link in code](not-actually-a-link)`
## Adjacent Formatting

**Bold***Italic*`Code` all adjacent
**No space: **bold***italic*~~strike~~*
*
## Malformed or Edge Syntax

**Unclosed bold
*Unclosed italic
[Unclosed link](

Mismatched **bold ending*

**Empty: **** and ** and 

```

**
**`
`**
**

```

**
****```
`**Single: * and * and *`*
*
- 

-

- [ ]

- [ ] 

- [ ]

1.

- 

-
- [ ] 
# 1. ****
