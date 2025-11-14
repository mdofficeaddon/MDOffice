# Checkbox Transformation Test

This document tests that ALL checkbox patterns are properly transformed in HTML exports.

## Pattern 1: Simple Checkbox (Should Work)

- [ ] Unchecked simple
- [x] Checked simple
- [ ] Another unchecked
- [X] Checked with capital X

## Pattern 2: Checkbox with Text on Same Line

- [ ] This is a simple unchecked task
- [x] This is a simple checked task
- [ ] Task with **bold text**
- [x] Task with *italic text*
- [ ] Task with `code`

## Pattern 3: Nested Checkboxes (Edge Case)

- [ ] Parent task
  - [ ] Child task level 1
    - [ ] Child task level 2
      - [ ] Child task level 3
        - [x] Deeply nested checked task

## Pattern 4: Mixed Nesting with Regular Lists

- [ ] Checkbox parent
  - Regular bullet child
  - [ ] Checkbox child
    - [ ] Checkbox grandchild

## Pattern 5: Checkbox After Numbered List

1. First numbered item
   - [ ] Checkbox under numbered
   - [x] Checked under numbered

## Pattern 6: Empty Checkboxes

- [ ]
- [x]
- [ ] 

## Pattern 7: Multiple Spaces

- [  ] Extra space inside (invalid but test it)
- [ ] Normal space
- [x] Normal checked

## Pattern 8: Checkbox with Inline HTML

- [ ] Task with <strong>inline HTML</strong>
- [x] Task with <em>emphasis</em>

## Pattern 9: Long Content

- [ ] This is a very long task that might span multiple lines in the rendered view and we want to make sure the checkbox transformation works correctly even with lots of text content that goes on and on
- [x] Another long completed task with lots of text to ensure the transformation handles multi-line rendering properly in the browser

## Pattern 10: Checkbox with Links

- [ ] Task with [a link](https://example.com)
- [x] Completed task with [another link](https://github.com)

## Pattern 11: Complex Nested Project

- [ ] Main Project
  - [ ] Phase 1
    - [x] Task 1.1 (done)
    - [x] Task 1.2 (done)
    - [ ] Task 1.3
      - [x] Subtask 1.3.1
      - [ ] Subtask 1.3.2
  - [ ] Phase 2
    - [ ] Task 2.1
    - [ ] Task 2.2
      - [ ] Subtask 2.2.1
      - [ ] Subtask 2.2.2
        - [ ] Deep subtask
        - [x] Another deep subtask (done)

## Pattern 12: Checkbox Mixed with Code Blocks

Some text here.

- [ ] Task before code
- [x] Checked before code

```javascript
// Some code
console.log("test");
```

- [ ] Task after code
- [x] Checked after code

## Pattern 13: Checkbox in Quotes Context

> This is a quote
> - [ ] Checkbox in quote
> - [x] Checked in quote

Regular list after quote:
- [ ] Normal checkbox
- [x] Normal checked

## Pattern 14: Multiple Consecutive Checkboxes

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
- [x] Task 4
- [x] Task 5
- [x] Task 6
- [ ] Task 7

## Pattern 15: Checkbox with Emoji

- [ ] Task with emoji 🚀
- [x] Completed with emoji ✅
- [ ] Multiple emojis 📝 ✨ 🎉

---

## Testing Checklist

After exporting this document to HTML, verify:

- [ ] All checkboxes appear as actual HTML checkboxes, not plain text
- [ ] Checked state (x/X) properly shows as checked checkboxes with green background
- [ ] Unchecked state shows as empty checkboxes with grey border
- [ ] Nested checkboxes maintain proper indentation
- [ ] Checkbox text aligns properly with the checkbox
- [ ] Blue-tinted backgrounds appear on nested items
- [ ] Connecting lines appear for nested structures
- [ ] No plain text like `[ ]` or `[x]` appears in the output
- [ ] All patterns from 1-15 above are properly transformed

If all items above are checked, the transformation is working perfectly! ✨

