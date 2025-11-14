# Image Rendering Tests

This file tests various image rendering scenarios in MDOffice.

## Basic Image

A simple image with alt text:

![MDOffice Logo](https://via.placeholder.com/400x200?text=MDOffice+Logo)

## Image with Link

Click the image to navigate:

[![Linked Image](https://via.placeholder.com/300x150?text=Click+Me)](https://code.visualstudio.com/)

## Multiple Images in a Row

### Side-by-Side Images

![Left Image](https://via.placeholder.com/200x150?text=Left) ![Right Image](https://via.placeholder.com/200x150?text=Right)

## Images with Different Sizes

### Large Image

![Large Image](https://via.placeholder.com/800x400?text=Large+Image)

### Small Image

![Small Image](https://via.placeholder.com/100x100?text=Small)

### Medium Image

![Medium Image](https://via.placeholder.com/500x300?text=Medium)

## Images in Lists

1. First item with image:
   ![Step 1](https://via.placeholder.com/150x100?text=Step+1)

2. Second item with image:
   ![Step 2](https://via.placeholder.com/150x100?text=Step+2)

3. Third item with image:
   ![Step 3](https://via.placeholder.com/150x100?text=Step+3)

## Images in Blockquotes

> This is a blockquote with an image:
> ![Quote Image](https://via.placeholder.com/300x150?text=In+Quote)

## Images in Tables

| Feature | Screenshot |
|---------|-----------|
| Editor View | ![Editor](https://via.placeholder.com/150x100?text=Editor) |
| Preview View | ![Preview](https://via.placeholder.com/150x100?text=Preview) |
| Settings | ![Settings](https://via.placeholder.com/150x100?text=Settings) |

## Image Alt Text Edge Cases

### Long Alt Text

![This is a very long and descriptive alt text that explains in detail what the image contains and why it's important to the documentation](https://via.placeholder.com/400x200?text=Long+Alt+Text)

### Alt Text with Special Characters

![Image with special chars: @#$%^&*()](https://via.placeholder.com/400x200?text=Special+Chars)

### Image with Empty Alt Text

![](https://via.placeholder.com/400x200?text=No+Alt+Text)

## Image URLs Variations

### HTTP Image

![HTTP Image](http://via.placeholder.com/300x200?text=HTTP)

### HTTPS Image (with query parameters)

![HTTPS Image](https://via.placeholder.com/300x200?text=HTTPS&bg=FF5733)

### Relative Path (for local files)

![Local Image](./images/sample.png)

## Images in Code Context

You can also reference images in descriptions:

- Logo: ![Logo](https://via.placeholder.com/50x50?text=Logo)
- Icon: ![Icon](https://via.placeholder.com/30x30?text=Icon)

## Image Edge Cases

### Malformed Image Syntax (should display as text)

[Image with wrong bracket](https://via.placeholder.com/300x200?text=Wrong)

### Image at End of Line

Some text followed by image ![Inline](https://via.placeholder.com/100x50?text=Inline)

### Multiple Images Paragraph

![Image 1](https://via.placeholder.com/150x100?text=Image+1) Some text in between ![Image 2](https://via.placeholder.com/150x100?text=Image+2)

---

**Test Complete!** This markdown file demonstrates various image rendering scenarios that MDOffice should handle correctly.




















