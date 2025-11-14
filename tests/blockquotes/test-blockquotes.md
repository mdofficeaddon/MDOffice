# Blockquotes Test Document

This document demonstrates nested blockquote support in the MDOffice - Markdown Office Editor.

## Basic Blockquotes

> This is a simple blockquote.
> It can span multiple lines.

> Another blockquote here.

## Nested Blockquotes (Level 2)

> This is the first level of quotation.
>
> > This is nested blockquote - level 2.
> > It's indented further.
>
> Back to level 1.

## Deeply Nested Blockquotes (Level 3)

> First level quote
>
> > Second level quote
> >
> > > Third level quote - this is deeply nested!
> > > Notice the different shading.
> >
> > Back to second level.
>
> Back to first level.

## Complex Nesting Example

> **Important Note:**
>
> This is a blockquote with **bold text** and *italic text*.
>
> > A nested quote with `inline code`.
> >
> > > And a deeply nested quote with [a link](https://example.com).
> > >
> > > Even deeper content!

## Blockquotes with Other Elements

> ### Heading in Blockquote
>
> You can include headings in blockquotes:
>
> - Bullet point 1
> - Bullet point 2
>   - Nested bullet
>
> 1. Numbered item 1
> 2. Numbered item 2
>
> Even code blocks:
>
> ```javascript
> function quote() {
>   return "Code in blockquote!";
> }
> ```

## Multiple Nested Levels

> Level 1: This represents a quote from a document.
>
> > Level 2: This is a quote within that document.
> >
> > > Level 3: And this is a quote within THAT quote!
> > >
> > > Notice how each level has different styling to help distinguish them.
> > >
> > > > You can even go deeper if needed, though it's rarely necessary.
> > >
> > > Back to level 3.
> >
> > Back to level 2.
>
> And finally back to level 1.

## Email-Style Conversation

> **Alice:** Hey, did you see the report?
>
> > **Bob:** Yes, I noticed this part:
> >
> > > **Report:** The quarterly results show a 15% increase in productivity.
> >
> > What do you think about it?
>
> **Alice:** I think it's great! We should celebrate.

## Mixed Content with Blockquotes

Here's some regular text before the quote.

> This is a blockquote that includes:
>
> - A checklist:
>   - [ ] Task 1
>   - [x] Task 2
>   - [ ] Task 3
>
> > And a nested quote with a table:
> >
> > | Feature | Status |
> > |---------|--------|
> > | Blockquotes | ✓ |
> > | Nesting | ✓ |
> > | Styling | ✓ |

And some regular text after the quote.

## Edge Cases

> Single line nested quote:
> > Another level
> > > And another!

> Interrupted nesting:
> > Level 2
>
> Back to level 1 (note the blank line above)
> > New level 2 section

## Real-World Example: Documentation

> **⚠️ Warning**
>
> This feature is experimental and may change in future releases.
>
> > **Note from the team:**
> >
> > We're actively working on stabilizing this API. Please report any issues you encounter.
> >
> > > **Developer tip:**
> > >
> > > Use version pinning to avoid breaking changes:
> > >
> > > ```json
> > > {
> > >   "dependencies": {
> > >     "package-name": "~1.2.3"
> > >   }
> > > }
> > > ```

## Blockquotes with Lists

> Main quote with nested lists:
>
> 1. First ordered item
>    > Quote within list item
>    >
>    > > Nested quote in list
> 2. Second ordered item
>    - Unordered sub-item
>      > Quote in unordered item

