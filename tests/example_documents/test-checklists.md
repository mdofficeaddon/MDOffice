# Checklist Test Document

This document demonstrates checklist (task list) support in the Markdown Office Editor.

## Basic Checklists

- [ ] Unchecked task
- [x] Completed task
- [ ] Another unchecked task
- [X] Completed with capital X (also works)

## Checklists with Text Formatting

- [ ] Task with **bold text**
- [x] Task with *italic text*
- [ ] Task with `inline code`
- [x] Task with ~~strikethrough~~
- [ ] Task with [a link](https://example.com)

## Nested Checklists

- [ ] Parent task
  - [ ] Child task 1
  - [x] Child task 2 (completed)
    - [ ] Grandchild task
    - [x] Another grandchild (completed)
- [x] Another parent (completed)
  - [ ] This child is not completed
  - [ ] Neither is this one

## Mixed Nested Lists

1. Numbered item
   - [ ] Checklist under numbered
   - [x] Completed checklist
     - Regular bullet under checklist
       - [ ] Deep nested checklist

- Regular bullet
  1. Numbered under bullet
     - [ ] Checklist under numbered
  2. Another numbered
     - [x] Completed checklist

## Complex Example: Project Plan

### Phase 1: Setup
- [x] Initialize project
- [x] Create repository
- [x] Setup development environment
  - [x] Install Node.js
  - [x] Install VS Code
  - [x] Install extensions

### Phase 2: Development
- [ ] Implement core features
  - [x] Basic editor
  - [x] Preview mode
  - [ ] Export functionality
    - [x] HTML export
    - [ ] PDF export
    - [ ] DOCX export
- [ ] Write documentation
  - [x] README
  - [ ] User guide
  - [ ] API docs

### Phase 3: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] User acceptance testing

### Phase 4: Release
- [ ] Create release notes
- [ ] Publish to marketplace
- [ ] Announce on social media

## Edge Cases

- [ ] Task with emoji 🚀 ✨ 📝
- [x] Task with multiple   spaces
- [ ] Task with `code` and **bold** and [link](https://example.com)
- [x] Very long task that might wrap to multiple lines in the preview, testing how the checkbox aligns with the text content when it spans across several lines

