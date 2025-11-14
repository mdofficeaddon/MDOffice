# Formatting Stress Test

This document stress tests various formatting combinations and edge cases.

## Compétitivité et capital

*Italic text*
***Bold and italic***
~~Strikethrough text~~
`Inline cod`
**Bold with *nested italic* inside****

*
*
*Italic with **nested bold** inside*
**Bold with `code` inside**
*Italic with `code` inside*
~~Strike with **bold** inside~~
~~Strike with ~~*~~italic~~*~~ inside**~~
~~Strike with `code` inside~~
`Code with **attempted bold** inside (should not work)`
## Massive Table

| H1 | H2 | H3 | H4 | H5 | H6 | H7 | H8 | H9 | H10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9 | A10 |
| B1 | B2 | B3 | B4 | B5 | B6 | B7 | B8 | B9 | B10 |
| C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 |
| D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | D10 |
| E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
| F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 | F10 |
| G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
| H1 | H2 | H3 | H4 | H5 | H6 | H7 | H8 | H9 | H10 |
| I1 | I2 | I3 | I4 | I5 | I6 | I7 | I8 | I9 | I10 |
| J1 | J2 | J3 | J4 | J5 | J6 | J7 | J8 | J9 | J10 |

## All Header Levels

# Header 1

## Header 2

### Header 3

#### Header 4

##### Header 5

###### Header 6

# 🎉 Header with Emoji

## Header with **Bold** Text

*### *Header with *Italic* Text*
*
#### Header with `Code` Text

##### Header with [Link](https://example.com)

###### Header with ~~Strikethrough~~

## Long Lists

1. Item 1

1. Item 2

1. Item 3

1. Item 4

1. Item 5

1. Item 6

1. Item 7

1. Item 8

1. Item 9

1. Item 10

1. Item 11

1. Item 12

1. Item 13

1. Item 14

1. Item 15

1. Item 16

1. Item 17

1. Item 18

1. Item 19

1. Item 20

1. Item 21

1. Item 22

1. Item 23

1. Item 24

1. Item 25

1. Item 26

1. Item 27

1. Item 28

1. Item 29

1. Item 30

## Bullet List Marathon

- Apple

- Banana

- Cherry

- Date

- Elderberry

- Fig

- Grape

- Honeydew

- Ice cream bean

- Jackfruit

- Kiwi

- Lemon

- Mango

- Nectarine

- Orange

- Papaya

- Quince

- Raspberry

- Strawberry

- Tangerine

- Ugli fruit

- Vanilla

- Watermelon

- Xigua

- Yellow passion fruit

- Zucchini

## Code Blocks in Many Languages

### Python

```

python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
`print(fibonacci(10))
`

```

### JavaScript

*
*
```
*`
`*`javascript
function factorial(n) {
    return n <= 1 ? 1 : n `* factorial(n - 1);
}
`console.log(factorial(5));
`
*
```

*
### Java

```

java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

```

### C++

```

cpp
#include <iostream>
`int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`

```

### HTML

```

html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>

```

### CSS

```

css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}
`h1 {
    color: #333;
    text-align: center;
}
`

```

### SQL

*
```
*`
sql
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user`*id
WHERE orders.status = 'completed'
ORDER BY orders.total DESC
LIMIT 10;
*
*
```

*
*
### Bash

```

bash
#!/bin/bash
`for i in {1..10}
do
    echo "Number: $i"
done
`

```

### JSON

```

json
{
    "name": "Test User",
    "email": "test@example.com",
    "age": 30,
    "active": true,
    "roles": ["user", "admin"],
    "metadata": {
        "created": "2023-01-01",
        "updated": "2023-12-31"
    }
}

```

### XML

```

xml
<?xml version="1.0" encoding="UTF-8"?>
<users>
    <user id="1">
        <name>John Doe</name>
        <email>john@example.com</email>
    </user>
    <user id="2">
        <name>Jane Smith</name>
        <email>jane@example.com</email>
    </user>
</users>

```

## Multiple Blockquotes

> First blockquote

> Second blockquote

> Third blockquote with **bold**

> Fourth blockquote with *italic*

> Fifth blockquote with `code`

> Sixth blockquote with [link](https://example.com)

> Seventh blockquote
> that spans multiple
> lines for testing
> purposes

## Link Collection

[Google](https://google.com)
[GitHub](https://github.com)
[Stack Overflow](https://stackoverflow.com)
[MDN](https://developer.mozilla.org)
[W3Schools](https://w3schools.com)
[Reddit](https://reddit.com)
[Twitter](https://twitter.com)
[Facebook](https://facebook.com)
[LinkedIn](https://linkedin.com)
[YouTube](https://youtube.com)
## Image Gallery

![Placeholder 1](https://via.placeholder.com/150)
![Placeholder 2](https://via.placeholder.com/150/FF0000)
![Placeholder 3](https://via.placeholder.com/150/00FF00)
![Placeholder 4](https://via.placeholder.com/150/0000FF)
![Placeholder 5](https://via.placeholder.com/150/FFFF00)
![Placeholder 6](https://via.placeholder.com/150/FF00FF)
![Placeholder 7](https://via.placeholder.com/150/00FFFF)
![Placeholder 8](https://via.placeholder.com/150/FFA500)

## Horizontal Rule Variations

---

*****

*
*
*_*
- - -

* * *
* * *
## Mixed Content Paragraph

This paragraph contains **bold text**, *italic text*, `inline code`, [a link](https://example.com), ~~strikethrough~~, ***bold italic***, and even some $math$ if supported. It also has an ![inline image](https://via.placeholder.com/20) and continues with more text. The goal is to test how all these elements render together in a single paragraph without breaking the flow or causing rendering issues.

## Stress Test Combinations

**Bold *and italic* together****

*
*
*Italic **and bold** together*
`Code with **bold** attempt`
[Link to **bold** text](https://example.com)
[**Bold** link text](https://example.com)
**[Bold link](https://example.com)**
*[Italic link](https://example.com)*
~~[Strikethrough link](https://example.com)~~
*> *

> **Bold blockquote** with *italic* and `code`
> *
> *

*
*
*- 
*- 
- ****Bold bullet** with *italic* and `code` and [link](url)**
- 

*
- 

*
*1. 
*1. 
2. ****Bold number** with *italic* and `code` and [link](url)**
3. 

*
1. 

*
| **Bold** | Italic**** | `Code` | [Link](url) | ~~Strike~~ |
| --- | --- | --- | --- | --- |
| B*** | I | `C` | [L](url) | ~~S~~ |

## Special Characters Collection

### Currency

$ € £ ¥ ₹ ₽ ₿ ¢ ₱ ₩ ₴ ₦ ₡ ₨

### Math

+ - × ÷ = ≠ < > ≤ ≥ ± ∓ ∑ ∫ √ ∞ π ∂ Δ Π

### Arrows

→ ← ↑ ↓ ↔ ⇒ ⇐ ⇑ ⇓ ⇔ ⤴ ⤵ ↩ ↪

### Shapes

○ ● ◯ ◆ ◇ ■ □ ▪ ▫ ▲ △ ▼ ▽ ★ ☆

### Symbols

© ® ™ § ¶ † ‡ • ‰ ′ ″ ‴ ‹ › « » ‐ ‑ ‒ – — ―

### Emoji

😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 ☺ 😚 😙

### More Emoji

❤ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣ 💕 💞 💓 💗 💖 💘 💝 ✨ ⭐ 🌟 ✅ ❌ ⚠ 🚀

## End of Stress Test

This is the end of the formatting stress test document. All edge cases above should render correctly!

*