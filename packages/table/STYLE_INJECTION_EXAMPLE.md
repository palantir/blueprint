# StyledRegionGroup Style Injection Feature

This document demonstrates the new style injection capability added to `StyledRegionGroup`.

## Overview

The `StyledRegionGroup` interface now supports direct CSS style injection via a new `style` property:

```typescript
interface StyledRegionGroup {
    className?: string;
    regions: Region[];
    style?: React.CSSProperties; // NEW: Direct style injection
}
```

## Usage Examples

### 1. Direct Style Injection Only

```tsx
const styledRegionGroups = [
    {
        regions: [Regions.cell(0, 0, 2, 2)],
        style: {
            backgroundColor: "rgba(255, 0, 0, 0.3)",
            border: "2px solid red",
            borderRadius: "4px",
        },
    },
];

<Table styledRegionGroups={styledRegionGroups} />;
```

### 2. CSS Class Only (Existing Behavior)

```tsx
const styledRegionGroups = [
    {
        className: "my-custom-region",
        regions: [Regions.cell(0, 0, 2, 2)],
    },
];

<Table styledRegionGroups={styledRegionGroups} />;
```

### 3. Combining CSS Class and Direct Styles

```tsx
const styledRegionGroups = [
    {
        className: "my-custom-region",
        regions: [Regions.cell(0, 0, 2, 2)],
        style: {
            backgroundColor: "rgba(0, 255, 0, 0.3)",
            border: "2px dashed green",
        },
    },
];

<Table styledRegionGroups={styledRegionGroups} />;
```

### 4. Styling Different Region Types

```tsx
const styledRegionGroups = [
    // Style a specific cell range
    {
        regions: [Regions.cell(0, 0, 1, 1)],
        style: { backgroundColor: "rgba(255, 0, 0, 0.3)" },
    },
    // Style an entire column
    {
        regions: [Regions.column(1)],
        style: {
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            borderLeft: "2px solid blue",
            borderRight: "2px solid blue",
        },
    },
    // Style an entire row
    {
        regions: [Regions.row(2)],
        style: {
            backgroundColor: "rgba(0, 255, 0, 0.1)",
            borderTop: "2px solid green",
            borderBottom: "2px solid green",
        },
    },
];
```

## Style Precedence

When both `className` and `style` are provided:

1. **Computed styles** from grid calculations are applied first
2. **Injected styles** from the `style` property are merged on top (taking precedence)
3. **CSS class styles** can still override via CSS specificity rules

This allows for flexible styling where you can:

-   Use direct styles for programmatic styling
-   Use CSS classes for theme-based styling
-   Combine both approaches as needed

## Benefits

-   **Programmatic styling**: Apply styles based on data or application state
-   **Dynamic styling**: Change styles without requiring CSS class updates
-   **Simplified styling**: No need to define CSS classes for simple style overrides
-   **Backward compatibility**: Existing `className`-based styling continues to work unchanged
