# Blueprint Design Tokens - Code Standards

## Core Principle: Never Use Magic Numbers

**CRITICAL**: Always use Blueprint design tokens. Never hardcode values.

## Available Blueprint Tokens

### Spacing (4px-based grid system)

```scss
$pt-spacing: 4px;  // Base spacing unit

// Examples:
padding: $pt-spacing;           // 4px
margin: $pt-spacing * 2;        // 8px
gap: $pt-spacing * 3;           // 12px
padding: $pt-spacing * 4;       // 16px
margin: $pt-spacing * 5;        // 20px
gap: $pt-spacing * 6;           // 24px
padding: $pt-spacing * 8;       // 32px
```

### Typography

```scss
// Font family
$pt-font-family: -apple-system, "BlinkMacSystemFont", "Segoe UI", "Roboto", ...;

// Font sizes
$pt-font-size: 14px;        // Base (equivalent to body)
$pt-font-size-large: 16px;  // Large text
$pt-font-size-small: 12px;  // Small text

// Line height
$pt-line-height: 1.28581;   // Base line height

// Font weights (hardcoded in Blueprint mixins)
// Regular: 400
// Medium/Heading: 600

// Letter spacing (hardcoded in Blueprint mixins)
// Base: 0
```

### Heading Sizes (from _typography.scss)

```scss
// H1: 36px / 40px line-height
// H2: 28px / 32px line-height
// H3: 22px / 25px line-height
// H4: 18px / 21px line-height  ← Use for section headers
// H5: 16px / 19px line-height
// H6: 14px / 16px line-height
```

### Border Radius

```scss
$pt-border-radius: 4px;  // Base border radius

// Examples:
border-radius: $pt-border-radius;         // 4px
border-radius: $pt-border-radius - 1px;   // 3px (small)
border-radius: $pt-border-radius + 2px;   // 6px (medium)
border-radius: $pt-border-radius * 3;     // 12px (large)
```

### Colors

```scss
@import "@blueprintjs/colors/src/colors";

// Grays
$black, $dark-gray1, $dark-gray2, $dark-gray3, $dark-gray4, $dark-gray5
$gray1, $gray2, $gray3, $gray4, $gray5
$light-gray1, $light-gray2, $light-gray3, $light-gray4, $light-gray5
$white

// Brand colors
$blue1, $blue2, $blue3, $blue4, $blue5
$green1, $green2, $green3, $green4, $green5
$orange1, $orange2, $orange3, $orange4, $orange5
$red1, $red2, $red3, $red4, $red5
// ... and more
```

### Icon Sizes

```scss
$pt-icon-size-standard: 16px;  // ($pt-spacing * 4)
$pt-icon-size-large: 20px;     // ($pt-spacing * 5)
```

### Component Heights

```scss
// Buttons
$pt-button-height: 30px;         // ($pt-spacing * 7.5)
$pt-button-height-small: 24px;   // ($pt-spacing * 6)
$pt-button-height-smaller: 20px; // ($pt-spacing * 5)
$pt-button-height-large: 40px;   // ($pt-spacing * 10)

// Inputs
$pt-input-height: 30px;          // ($pt-spacing * 7.5)
$pt-input-height-large: 40px;    // ($pt-spacing * 10)
$pt-input-height-small: 24px;    // ($pt-spacing * 6)

// Navbar
$pt-navbar-height: 50px;         // ($pt-spacing * 12.5)
```

## How to Import

```scss
@import "@blueprintjs/colors/src/colors";
@import "@blueprintjs/core/src/common/variables";
```

## Examples: Good vs Bad

### ❌ BAD - Magic Numbers
```scss
.header {
  padding: 16px 32px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  border-radius: 6px;
}
```

### ✅ GOOD - Blueprint Tokens
```scss
.header {
  padding: $pt-spacing * 4 $pt-spacing * 8;
  font-size: $pt-font-size;
  font-weight: 600;  // Blueprint heading weight (no variable available)
  letter-spacing: 0; // Blueprint base letter-spacing (no variable available)
  border-radius: $pt-border-radius + 2px;
}
```

### ❌ BAD - Custom spacing values
```scss
.card {
  margin: 12px;
  padding: 20px;
  gap: 8px;
}
```

### ✅ GOOD - 4px grid system
```scss
.card {
  margin: $pt-spacing * 3;  // 12px
  padding: $pt-spacing * 5; // 20px
  gap: $pt-spacing * 2;     // 8px
}
```

## Notes

- **Font weights**: Blueprint doesn't have `$pt-font-weight-*` variables. Use hardcoded values:
  - Regular: `400`
  - Medium/Heading: `600`

- **Letter spacing**: Blueprint doesn't have `$pt-letter-spacing-*` variables. Use hardcoded `0` for base text.

- **Spacing**: Always use multiples of `$pt-spacing` (4px) for consistency with Blueprint's design system.

- **Typography sizing**: While Blueprint has specific heading classes, if you need custom font sizes, reference the heading scale for consistency.

## When Hardcoding is Acceptable

Hardcoded values are only acceptable when:
1. Blueprint doesn't provide a token (e.g., `font-weight: 600`, `letter-spacing: 0`)
2. The value is a calculated offset that uses Blueprint tokens as a base (e.g., `$pt-border-radius + 2px`)
3. The value is inherently fixed and not part of the design system (e.g., `border-radius: 999px` for pills, `z-index` for layering)

**Always comment why a hardcoded value is used if it's not obvious.**
