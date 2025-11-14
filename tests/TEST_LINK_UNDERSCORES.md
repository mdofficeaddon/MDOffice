# Test: Links with Underscores in Filenames

This test document verifies that markdown file links work correctly with underscores in filenames.

## Background
Previously, underscores in filenames were being converted to `<em>` tags before link processing, causing links like `TEST_IMAGES.md` to become `TEST<em>IMAGES</em>.md`.

## Test Cases

### 1. Simple Link with Underscores
This link contains underscores in the filename:

[Open Test Images](./TEST_IMAGES.md)

**Expected**: Should open `TEST_IMAGES.md` in MDOffice editor  
**Previous Behavior**: Error "File not found: ./TEST<em>IMAGES</em>.md"

### 2. Multiple Underscores
[Open Link Navigation Test](./LINK_NAVIGATION_TEST.md)

**Expected**: Should open `LINK_NAVIGATION_TEST.md`

### 3. Link with Anchor
[Go to PNG Test in TEST_IMAGES](./TEST_IMAGES.md#png-test)

**Expected**: Should open file and scroll to PNG Test section

### 4. Parent Directory with Underscores
[Open Main README](../README.md)

**Expected**: Should open the main README file

### 5. Subdirectory Link
[Open Subfolder Test](./images/test-images.md)

**Expected**: Should open test-images.md in images folder

## Verification Checklist

When testing, verify:
- ✅ Link appears in **green** color with 📄 icon
- ✅ Clicking opens the target file in MDOffice editor
- ✅ No error messages about file not found
- ✅ File path in error (if any) contains underscores, not `<em>` tags
- ✅ Anchor links scroll to correct heading
- ✅ Hover tooltip shows correct filename

## Additional Tests

### Mixed Formatting
Test that underscores still work for *italic* and **bold** text outside of links:

- This is _italic text_ with underscores
- This is __bold text__ with double underscores
- But this [link to TEST_IMAGES](./TEST_IMAGES.md) should preserve underscores

### Edge Cases
- Link at start of line: [TEST_IMAGES.md](./TEST_IMAGES.md)
- Link at end: Open this file [TEST_IMAGES.md](./TEST_IMAGES.md)
- Multiple links: [First](./TEST_IMAGES.md) and [Second](./LINK_NAVIGATION_TEST.md)

## Technical Notes

The fix involved reordering the markdown parsing sequence:
1. Images (first, to avoid conflicting with link syntax)
2. **Links** (before formatting, to preserve special chars in URLs)
3. Bold/Italic/Strikethrough (after links are converted to HTML)

This ensures that link URLs are fully parsed into `<a>` tags before any underscore-based formatting is applied.

