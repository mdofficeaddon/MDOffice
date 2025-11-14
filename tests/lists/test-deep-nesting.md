# Deep Nesting Test Document

This document tests the enhanced styling for deeply nested lists in HTML exports.

## Test 1: Deep Bullet List (6+ Levels)

- Level 1: Disc bullet (●)
  - Level 2: Circle bullet (○)
    - Level 3: Square bullet (■) - with subtle left border
      - Level 4: Disc bullet - with light background shading
        - Level 5: Circle bullet - with stronger background
          - Level 6: Square bullet - with strongest background
            - Level 7: Disc bullet - cycling continues
              - Level 8: Circle bullet
                - Level 9: Square bullet
                  - Level 10: Even deeper!

## Test 2: Deep Numbered List (6+ Levels)

1. Level 1: Numbers (1, 2, 3)
   1. Level 2: Lowercase letters (a, b, c)
      1. Level 3: Roman numerals (i, ii, iii) - with border
         1. Level 4: Back to numbers - with background shading
            1. Level 5: Back to letters - stronger shading
               1. Level 6: Back to roman - strongest shading
                  1. Level 7: Cycling continues
                     1. Level 8: Still going
                        1. Level 9: Very deep
                           1. Level 10: Maximum depth!

## Test 3: Mixed Deep Nesting

1. Project Overview
   - Key objectives
     - Primary goal
       - Specific target A
         1. Action item 1
         2. Action item 2
            - Sub-action A
              - Detail 1
                - Sub-detail i
                  - Deep sub-detail α
   - Timeline
     1. Q1 2024
        - January
          1. Week 1
          2. Week 2
             - Monday tasks
               1. Morning
               2. Afternoon
                  - Task A
                  - Task B
                    1. Subtask B1
                    2. Subtask B2

## Test 4: Documentation Outline (Real-World Example)

1. **Introduction**
   1. Purpose
      - Target audience
        - Developers
          - Frontend developers
            - React specialists
            - Vue specialists
          - Backend developers
            - Node.js developers
            - Python developers
        - Technical writers
        - Project managers
   2. Prerequisites
      - Software requirements
        1. Node.js v18+
        2. npm v9+
           - Package installation
             - Global packages
             - Local packages
   3. Getting Started
      - Quick start guide
        1. Clone repository
        2. Install dependencies
           - Core dependencies
             - Production packages
               - Express
               - React
               - Database drivers
             - Development packages
               - Testing frameworks
               - Linters
               - Build tools
        3. Configure environment
           - Environment variables
             1. Database connection
             2. API keys
             3. Feature flags

## Test 5: Recipe with Nested Instructions

1. **Preparation** (15 minutes)
   1. Gather ingredients
      - Dry ingredients
        - 2 cups flour
          - All-purpose flour works best
          - Sift before measuring
        - 1 tsp baking powder
        - 1/2 tsp salt
      - Wet ingredients
        - 2 eggs
          - Room temperature preferred
          - Beat lightly before adding
        - 1 cup milk
        - 1/4 cup oil
   2. Prepare equipment
      - Mixing bowls
        1. Large bowl for dry
        2. Medium bowl for wet
      - Baking pan
        - 9x13 inch
          - Grease thoroughly
            - Use butter or oil
            - Coat corners well

2. **Mixing** (5 minutes)
   1. Combine dry ingredients
      - Whisk together in large bowl
        - Ensure even distribution
          - No clumps
          - Well aerated
   2. Combine wet ingredients
      - Mix in separate bowl
        - Beat eggs first
          - Until frothy
        - Add milk slowly
        - Mix in oil last
   3. Combine wet and dry
      - Pour wet into dry
        - Mix gently
          - Don't overmix
            - Stop when just combined
            - Some lumps are okay

## Test 6: File System Structure

- **Project Root**
  - src/
    - components/
      - common/
        - Button/
          - Button.tsx
            - Main component file
          - Button.test.tsx
            - Unit tests
          - Button.styles.css
            - Component styles
        - Input/
          - Input.tsx
          - Input.test.tsx
      - features/
        - auth/
          - Login/
            - Login.tsx
            - LoginForm.tsx
              - Form validation
              - Error handling
          - Register/
        - dashboard/
          - Dashboard.tsx
          - widgets/
            - Chart.tsx
            - Statistics.tsx
              - Revenue stats
              - User stats
                - Active users
                - New registrations
    - utils/
      - api/
        - client.ts
        - endpoints.ts
          - Authentication endpoints
            - POST /login
            - POST /register
            - POST /logout
          - Data endpoints
            - GET /users
              - Query parameters
                - page
                - limit
                - sort
    - types/
      - index.ts
      - models/
        - User.ts
        - Post.ts

## Test 7: Task Breakdown (Project Management)

1. **Phase 1: Planning** (2 weeks)
   1. Requirements gathering
      - Stakeholder interviews
        1. Executive team
           - CEO
             - Vision and goals
           - CTO
             - Technical constraints
        2. Department heads
           - Marketing
           - Sales
           - Operations
      - User research
        - Survey existing users
          1. Prepare questionnaire
          2. Conduct surveys
             - Online survey
               - Email distribution
               - Social media
             - In-person interviews
          3. Analyze results
   2. Technical specification
      - Architecture design
        1. System components
           - Frontend
             - Framework selection
               - React
                 - Pros and cons
                 - Team expertise
               - Vue
               - Angular
           - Backend
             - API design
               - RESTful
                 - Endpoint structure
                 - Authentication
               - GraphQL
           - Database
        2. Integration points
        3. Security requirements

2. **Phase 2: Development** (8 weeks)
   1. Sprint 1: Foundation
   2. Sprint 2: Core features
   3. Sprint 3: Advanced features
   4. Sprint 4: Polish

3. **Phase 3: Testing** (3 weeks)
   1. Unit testing
   2. Integration testing
   3. User acceptance testing

4. **Phase 4: Deployment** (1 week)
   1. Production setup
   2. Data migration
   3. Go-live

## Visual Features to Verify

When viewing the exported HTML, check for:

1. **Progressive Bullet Styles**
   - Level 1: ● (disc)
   - Level 2: ○ (circle)
   - Level 3: ■ (square)
   - Cycles continue for deeper levels

2. **Progressive Number Styles**
   - Level 1: 1, 2, 3 (decimal)
   - Level 2: a, b, c (lower-alpha)
   - Level 3: i, ii, iii (lower-roman)
   - Cycles continue for deeper levels

3. **Visual Depth Indicators**
   - Level 3+: Subtle left border appears
   - Level 4+: Light grey background shading
   - Level 5+: Stronger background shading
   - Level 6+: Strongest background shading

4. **Progressive Spacing**
   - Top-level items: 8px margin
   - Level 2 items: 6px margin
   - Level 3 items: 4px margin
   - Level 4 items: 3px margin
   - Level 5+ items: 2px margin

5. **Nested List Margins**
   - Level 1 nested: 6px top/bottom
   - Level 2 nested: 4px top/bottom
   - Level 3+ nested: 2px top/bottom

---

**All improvements should make deeply nested lists:**
- ✅ Easy to scan visually
- ✅ Clear hierarchical structure
- ✅ Comfortable to read even at 10+ levels
- ✅ Professional appearance
- ✅ Distinct visual cues for each level

