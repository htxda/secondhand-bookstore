# Design System Specification: The Botanical Atelier

## 1. Overview & Creative North Star
**Creative North Star: "The Verdant Gallery"**

This design system moves away from the aggressive, high-contrast layouts of traditional e-commerce. Instead, it adopts an editorial, gallery-like approach where the shopping experience feels curated rather than transactional. By utilizing a "Soft Minimalist" aesthetic, we prioritize breathing room, organic tonal shifts, and sophisticated typography.

The system breaks the "standard template" look through **intentional asymmetry**—such as off-center product imagery and staggered grid layouts—and **tonal depth**. We treat the digital interface as a series of premium paper stocks layered atop one another, using light and shadow to guide the eye rather than rigid lines.

---

## 2. Colors & Surface Philosophy

The palette is rooted in low-saturation botanical tones, designed to feel calming and expensive.

### Color Tokens (Material Design Convention)
*   **Primary (Sage):** `#4b664a` (Core brand actions)
*   **Primary Container (Pale Mint):** `#ccebc7` (Subtle emphasis)
*   **Surface/Background:** `#f8faf8` (The canvas)
*   **On-Surface (Charcoal):** `#2d3432` (Primary text)
*   **Outline-Variant (Warm Gray):** `#acb4b1` (Auxiliary elements)

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined through:
1.  **Background Color Shifts:** Use `surface-container-low` for secondary sections sitting on a `surface` background.
2.  **Negative Space:** Utilize the Spacing Scale (specifically `10` [3.5rem] and `12` [4rem]) to create conceptual boundaries.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Use the `surface-container` tiers to create "nested" depth:
*   **Base Layer:** `surface` (#f8faf8).
*   **Secondary Content:** `surface-container-low` (#f1f4f2).
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) to create a subtle "lift" against the off-white background.

### Signature Textures: Glass & Gradients
Avoid flat "fill" colors for large areas. 
*   **CTAs:** Use a subtle linear gradient from `primary` (#4b664a) to `primary_dim` (#3f593f) to provide visual "soul."
*   **Floating Navigation:** Utilize **Glassmorphism**. Apply `surface` at 70% opacity with a `20px` backdrop-blur to allow product colors to bleed through softly.

---

## 3. Typography: The Editorial Voice

We utilize a pairing of **Epilogue** (Display/Headlines) and **Manrope** (Body/Labels) to balance character with legibility.

*   **Display-LG (Epilogue, 3.5rem):** Reserved for hero titles and major promotional headers. High-impact, low-kerning.
*   **Headline-SM (Epilogue, 1.5rem):** Used for product names in the cart. Conveys authority and craft.
*   **Title-MD (Manrope, 1.125rem):** Used for section headers within the checkout flow (e.g., "Shipping Method").
*   **Body-MD (Manrope, 0.875rem):** The workhorse for product descriptions and details. 
*   **Label-MD (Manrope, 0.75rem):** All-caps with increased letter spacing for utility text (e.g., "SKU", "TOTAL").

The typography scale is intentionally dramatic. A large `display-lg` header next to a small, refined `label-md` creates the "high-fashion" contrast necessary for a premium feel.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering**. Instead of a shadow, place a `surface-container-lowest` (pure white) card on a `surface-container` (soft gray-green) background. The contrast in lightness provides enough "lift" for the eye without adding visual clutter.

### Ambient Shadows
When a floating effect is required (e.g., a "Quick Add" modal), use the following:
*   **Blur:** `48px` to `64px`.
*   **Opacity:** 4%–6%.
*   **Color:** Use a tinted version of `on-surface` (Charcoal) mixed with `primary`. This mimics natural ambient light in a forest-like environment rather than a synthetic gray shadow.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., input fields), use the `outline-variant` token at **15% opacity**. High-contrast, 100% opaque borders are strictly forbidden as they break the soft, organic aesthetic.

---

## 5. Components

### Buttons
*   **Primary:** Fill with Sage-to-Dark-Sage gradient. Corner radius: `full` (9999px) for a pill shape or `xl` (3rem) for a signature look.
*   **Secondary:** `surface-container-high` background with `on-surface` text. No border.
*   **Tertiary:** Text-only with an underline that appears on hover, using the `primary` color.

### Input Fields
*   **Style:** Minimalist. No background fill. Only a "Ghost Border" bottom-line or a very soft `surface-container-low` background with `xl` (3rem) rounding.
*   **States:** On focus, the bottom border transitions to `primary` (#4b664a) at 100% opacity.

### Shopping Cart Cards
*   **Style:** Forbid the use of divider lines. 
*   **Layout:** Use `surface-container-lowest` for the card background. Use the spacing token `6` (2rem) for internal padding.
*   **Image:** Use `lg` (2rem) rounding on product thumbnails to match the soft-minimalist language.

### Checkout Progress Stepper
*   **Editorial Twist:** Avoid the "circles and lines" look. Use a large, faded `display-sm` number (e.g., "01") in `primary_fixed_dim` next to the section title to denote progress.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical padding. Allow more white space on the left than the right to create an editorial "break."
*   **Do** use the `surface-tint` to subtly color-wash large images.
*   **Do** prioritize vertical white space over horizontal lines.

### Don't:
*   **Don't** use standard "drop shadows" (e.g., `0px 4px 10px rgba(0,0,0,0.1)`). They feel dated and "out-of-the-box."
*   **Don't** use pure black (#000000). Always use the `Charcoal` (#1F2937) for text to keep the "low-saturation" premium feel.
*   **Don't** use sharp corners. Every element must adhere to the `md` (1.5rem) to `xl` (3rem) rounding scale to maintain the organic "Sage" brand personality.