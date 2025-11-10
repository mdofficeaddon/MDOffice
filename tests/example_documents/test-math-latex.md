# Math and LaTeX Test Document

This document tests inline math and display math equations using $ delimiters.

## Inline Math Expressions

Here is an inline equation: $E = mc^2$, which is Einstein's famous equation.

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ and it's used frequently.

Simple math: $a + b = c$ and $x^2 + y^2 = z^2$ for right triangles.

## Display Math (Block)

Here's the Pythagorean theorem in display mode:

$$
a^2 + b^2 = c^2
$$

The quadratic formula:

$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$

## Greek Letters

Inline: $\alpha$, $\beta$, $\gamma$, $\delta$, $\epsilon$, $\theta$, $\pi$, $\sigma$, $\omega$

Uppercase: $\Gamma$, $\Delta$, $\Theta$, $\Pi$, $\Sigma$, $\Omega$

## Summation and Integration

Sum from 1 to n: $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

Integral: $\int_{0}^{\infty} e^{-x} dx = 1$

Display version:

$$
\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}
$$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Matrices

A 2×2 matrix inline: $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$

Display matrix:

$$
A = \begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

## Fractions and Nested Operations

Simple fraction: $\frac{1}{2}$ or $\frac{3}{4}$

Nested fraction: $\frac{1}{1 + \frac{1}{2}}$

Complex expression:

$$
f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

## Mixed Math and Text

The value of $\pi$ is approximately 3.14159. When calculating the area of a circle, we use $A = \pi r^2$ where $r$ is the radius.

For a circle with radius $r = 5$, the area is $A = \pi \cdot 5^2 = 25\pi \approx 78.54$ square units.

## Dollar Signs vs Math

Regular dollar amounts: \$100, \$250.50, \$1,000,000

Math mode dollars: $\$100$ in math mode

Mixed: The price is \$50, but the formula is $y = mx + b$ where $m$ is the slope.

## Table with Math Expressions

| Formula | Name | Value |
|---------|------|-------|
| $\pi$ | Pi | 3.14159 |
| $e$ | Euler's number | 2.71828 |
| $\phi$ | Golden ratio | 1.61803 |
| $\sqrt{2}$ | Root 2 | 1.41421 |

## Complex Mathematical Expressions

Limit definition:

$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$

Derivative:

$$
\frac{d}{dx}(x^n) = nx^{n-1}
$$

Partial derivative:

$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h, y) - f(x, y)}{h}
$$

## Set Theory and Logic

Set notation: $A \cup B$, $A \cap B$, $A \subseteq B$, $x \in A$

Logical operators: $\land$ (and), $\lor$ (or), $\neg$ (not), $\implies$ (implies)

Display:

$$
A \cap B = \{x : x \in A \land x \in B\}
$$

## Multiple Equations

$$
\begin{aligned}
x + y &= 10 \\
2x - y &= 5 \\
\therefore x &= 5, y = 5
\end{aligned}
$$

## Edge Cases

Dollar sign tests:
- Normal dollar: \$
- Math mode: $x$
- Two dollars: $$inline still$$
- Escaped in math: $\$100$

Multiple inline: $a$, $b$, $c$ all on one line.

Back-to-back: $x$$y$ (might cause issues)

With text between: $x$ and $y$ equals $z$



