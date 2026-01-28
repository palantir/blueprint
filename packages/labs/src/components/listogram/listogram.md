---
tag: new
---

@# Listogram

**Listogram** is a component that displays a list of items with horizontal bar visualizations representing their counts, supporting various selection interactions.

@## Import

```tsx
import { Listogram, MultiListogram } from "@blueprintjs/labs";
```

@## Usage

@reactExample ListogramExample

@## Props

`Listogram` is designed to be both easy and flexible in its use. In its simplest form, provide an array of `items` and the component will handle everything for you (including selection!), no external state required.

Controlling selection is easy: simply provide `selectedItemIds` and use `onSelectionChange` to respond to user interactions.

@## Selection Modes

Several kinds of selection are supported through the `selectionKind` prop:

- **SINGLE** – clicking an item causes only that item to be selected.
- **MULTIPLE** – clicking an item selects only that item; use cmd/ctrl click to toggle items and shift click to add ranges.
- **TOGGLE** – similar to multiple but clicking an item toggles its state.

You can also disable selection by setting `disableSelection` to `true`, which will not clear any existing selection but will prevent it from updating. A controlled selection state can still be rendered using `selectedItemIds`.

@## Selection Style

The `selectionMode` prop controls how selected items are visually represented:

- **KEEPING** – selected items appear highlighted (default)
- **EXCLUDING** – selected items appear struck through, indicating exclusion

@## Listogram Props

@interface IListogramProps

@# MultiListogram

**MultiListogram** allows displaying multiple counts (series) for each item, useful for comparing data across different categories or time periods.

@## Differences from Listogram

The `MultiListogram` items cannot be sorted. However, sorting order of props is preserved in two respects:
- The order of `series` within each item is determined by their order in the `seriesMetadata` prop.
- The order of `items` is also determined by the order used in the `items` prop.

@## MultiListogram Props

@interface IMultiListogramProps
