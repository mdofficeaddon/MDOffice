# Link Navigation Test Document

This document demonstrates the enhanced link support in MDOffice v0.2.7.

## Table of Contents

- [Internal Anchor Links](#internal-anchor-links)

- [Markdown File Links](#markdown-file-links)

- [Combined File and Anchor Links](#combined-file-and-anchor-links)

- [External Links](#external-links)

- [Features Overview](#features-overview)

---

## Internal Anchor Links

These links navigate to different sections within this document:

- [Jump to Features Overview](#features-overview)

- [See External Links section](#external-links)

- [Back to top](#link-navigation-test-document)

- [Go to Markdown File Links](#markdown-file-links)

**Visual indicator**: These links appear in **purple** and provide smooth scrolling.
---

## Markdown File Links

These links open other markdown files in the MDOffice editor:

### Same Folder Links
- [View Test Images Document](./TEST_IMAGES.md) - Opens test file for image display testing
- [View Test Images (Root)](./TEST_IMAGES_ROOT.md) - Opens root-level image test file
- [Open Underscore Link Test](./TEST_LINK_UNDERSCORES.md) - Tests links with underscores in filenames

### Parent Folder Links
- [See Main README](../README.md) - Opens the main project README file

### Subfolder Links
- [Images Test (Subfolder)](./images/test-images.md) - Opens test file in images subfolder
- [Image Support Test](./images/test-image-support.md) - Opens image support test in subfolder
- [Nested Lists Test](./lists/test-nested-lists-showcase.md) - Opens nested lists showcase
- [Tables Test](./tables/test-tables.md) - Opens tables test in subfolder

**Visual indicator**: These links appear in **green** with a 📄 icon.

**Note**: These links automatically:
- Resolve relative paths (same folder, parent, or subfolders)
- Open in MDOffice editor
- Work from any location in your workspace
- Support special characters and underscores in filenames

---

## Combined File and Anchor Links

These links open another file AND scroll to a specific section:

### Parent Folder with Anchors
- [README - Installation](../README.md#installation) - Opens README and jumps to Installation section
- [README - Features](../README.md#features) - Opens README and jumps to Features section
- [README - Configuration](../README.md#configuration) - Opens README and jumps to Configuration section

### Same Folder with Anchors
- [Test Images - Test 1](./TEST_IMAGES_ROOT.md#test-1-image-avec-chemin-relatif-standard) - Opens test file and jumps to first test
- [Underscore Test - Background](./TEST_LINK_UNDERSCORES.md#background) - Opens and jumps to Background section

### Subfolder with Anchors
- [Images Test - Test 1](./images/test-images.md#test-1-local-image-relative-path) - Opens subfolder file and jumps to section
- [Tables Test - Special Chars](./tables/test-tables-special-chars.md#table-with-special-characters) - Opens tables test with anchor

**Visual indicator**: These also appear in **green** with the 📄 icon.

**What happens**:
1. The target file opens in MDOffice editor
2. The preview scrolls to the specified heading
3. The heading is briefly highlighted in yellow

---

## External Links

These links open in your default browser:

- [MDOffice GitHub Repository](https://github.com/mdofficeaddon/MDOffice)

- [VS Code Marketplace](https://marketplace.visualstudio.com/)

- [Markdown Guide](https://www.markdownguide.org/)

**Visual indicator**: These links appear in **blue** and open in a new tab.
---

## Features Overview

### Automatic Heading IDs

Every heading automatically gets an ID based on its text:

- `## Getting Started` → `id="getting-started"`

- `## API & SDK` → `id="api-sdk"`

- `## 123 Numbers!` → `id="123-numbers"`

This makes anchor links work seamlessly without manual ID assignment.

### Visual Feedback

When you click a link:

- **Markdown files**: Opens immediately in MDOffice

- **Anchor links**: Smooth scrolls with yellow highlight

- **External links**: Opens in new browser tab

- **Hover**: Shows tooltip with destination

### Link Types Summary

| Type | Color | Icon | Behavior |
| --- | --- | --- | --- |
| Markdown File | Green | 📄 | Opens in MDOffice |
| Anchor (same doc) | Purple | 🔗 | Scrolls smoothly |
| File + Anchor | Green | 📄 | Opens & scrolls |
| External (HTTP/S) | Blue | - | Opens in browser |

---

## Test Examples

### Relative Paths

```markdown
[Sibling file](./TEST_IMAGES.md)
[Parent folder](../README.md)
[Subfolder](./images/test-images.md)
[Deep subfolder](./lists/test-nested-lists-showcase.md)
```

### Anchor Formats

```markdown
[Simple heading](#features)
[Multi-word heading](#getting-started)
[Special chars](#api-sdk)
[With underscores](#test_examples)
```

### Combined (File + Anchor)

```markdown
[Same folder + anchor](./TEST_IMAGES.md#test-1)
[Parent + anchor](../README.md#installation)
[Subfolder + anchor](./images/test-images.md#test-1-local-image-relative-path)
```

### Path Variations

```markdown
[With ./](./TEST_IMAGES.md)
[Without ./](TEST_IMAGES.md)
[Parent](../README.md)
[Subfolder](./images/test-images.md)
[Nested subfolder](./lists/edge-cases/test.md)
```

---

## Testing Checklist

Test the following scenarios:

### Basic Navigation
- [ ] Click internal anchor link (same document)
- [ ] Click markdown file link (same folder)
- [ ] Click markdown file link (parent folder)
- [ ] Click markdown file link (subfolder)
- [ ] Click external HTTPS link

### Combined Links
- [ ] Click combined file + anchor link (same folder)
- [ ] Click combined file + anchor link (parent folder)
- [ ] Click combined file + anchor link (subfolder)

### Special Cases
- [ ] Click link with underscores in filename (e.g., TEST_IMAGES.md)
- [ ] Click link with spaces or special chars in path
- [ ] Click nested subfolder link (e.g., ./lists/test-nested-lists-showcase.md)

### Visual Indicators
- [ ] Verify green color for .md links
- [ ] Verify purple color for anchor links
- [ ] Verify 📄 icon appears on markdown file links
- [ ] Verify smooth scrolling animation
- [ ] Verify heading highlight (yellow) on anchor navigation
- [ ] Verify hover tooltips show correct paths

---

## Conclusion

The enhanced link support transforms MDOffice into a powerful documentation and note-taking tool, allowing you to create interconnected markdown files that work like a personal wiki!

**Key Benefits**:
- ✅ Navigate complex documentation easily

- ✅ Build interconnected knowledge bases

- ✅ Intuitive visual indicators

- ✅ Professional documentation workflows

- ✅ No manual configuration needed

[Back to top](#link-navigation-test-document)