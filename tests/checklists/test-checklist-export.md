# Checklist Export Test

This document tests that exported HTML checklists match the office view appearance.

## Simple Checklist

- [x] Completed task
- [ ] Pending task
- [x] Another completed task
- [ ] Another pending task

## Nested Checklist - Single Level

- [x] Main task 1 (completed)
  - [x] Subtask 1.1 (completed)
  - [ ] Subtask 1.2 (pending)
  - [x] Subtask 1.3 (completed)
- [ ] Main task 2 (pending)
  - [ ] Subtask 2.1 (pending)
  - [ ] Subtask 2.2 (pending)

## Deep Nesting - Multiple Levels

- [x] Project Setup
  - [x] Initialize repository
    - [x] Create Git repo
    - [x] Add .gitignore
    - [x] Create README
  - [ ] Configure tools
    - [x] Install Node.js
    - [ ] Install VS Code extensions
      - [x] ESLint
      - [ ] Prettier
      - [ ] GitLens

## Complex Project Checklist

- [ ] Frontend Development
  - [x] Setup React project
    - [x] Create React App
    - [x] Install dependencies
    - [x] Configure TypeScript
  - [ ] Build components
    - [x] Header component
    - [x] Navigation component
    - [ ] Dashboard component
      - [x] Statistics widget
      - [ ] Chart widget
      - [ ] Activity feed
    - [ ] Footer component
  - [ ] Styling
    - [x] Setup Tailwind CSS
    - [ ] Create theme
    - [ ] Implement dark mode

- [ ] Backend Development
  - [x] Setup Express server
    - [x] Initialize project
    - [x] Configure middleware
  - [ ] Database
    - [x] Design schema
    - [ ] Create migrations
      - [x] Users table
      - [ ] Posts table
      - [ ] Comments table
    - [ ] Seed data
  - [ ] API endpoints
    - [x] Authentication
      - [x] Login
      - [x] Register
      - [ ] Password reset
    - [ ] CRUD operations
      - [x] Create
      - [x] Read
      - [ ] Update
      - [ ] Delete

## Mixed Content Checklist

- [x] **Bold completed task**
- [ ] *Italic pending task*
- [x] Task with `code inline`
  - [x] Nested task with [link](https://example.com)
  - [ ] Another nested task
    - [x] Deep nested with **bold** and *italic*
    - [ ] Deep nested with code: `npm install`

## Visual Features to Check

When comparing the exported HTML to the office view, verify:

1. **Checkbox appearance**: Same size (18x18), rounded corners, grey border
2. **Checked state**: Green background (#4CAF50) with white checkmark
3. **Hover effects**: 
   - Checkboxes get darker border and shadow on hover
   - Task items get subtle background highlight
4. **Blue tinted backgrounds**: Nested items have progressive blue tint
   - Level 1: rgba(100, 100, 255, 0.02)
   - Level 2: rgba(100, 100, 255, 0.04)
   - Level 3: rgba(100, 100, 255, 0.06)
   - Level 4: rgba(100, 100, 255, 0.08)
5. **Connecting lines**: 
   - Vertical gradient line on the left
   - Horizontal connector to each item
6. **Strikethrough**: Completed tasks have grey text with line-through
7. **Spacing**: Consistent padding and margins

---

**Testing Instructions:**

1. Open this file in MD Office Editor
2. View it in the office preview (should look great)
3. Export to HTML
4. Open the HTML in a browser
5. Compare the appearance - they should now match! ✨

