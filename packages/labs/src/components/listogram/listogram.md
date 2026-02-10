---
tag: new
---

@# Listogram

A list of items with horizontal bar visualizations representing their counts, supporting various selection interactions.

@reactCodeExample ListogramBasicExample

@## Import

```tsx
import { Listogram } from "@blueprintjs/labs";
```

@## Usage

In its simplest form, provide an array of `items` and the component handles
everything including selection — no external state required. To control
selection, provide `selectedItemIds` and use `onSelectionChange` to respond
to user interactions.

@## Examples

@### Selection kind

Use the `selectionKind` prop to control selection behavior.

@#### Single

Clicking an item selects only that item; any previous selection is cleared.

@reactCodeExample ListogramSelectionSingleExample

@#### Multiple

Click to select; Cmd/Ctrl-click to toggle individual items; Shift-click to select a range. This is the default mode.

@reactCodeExample ListogramSelectionMultipleExample

@#### Toggle

Clicking an item toggles its selected state independently.

@reactCodeExample ListogramSelectionToggleExample

Use `disableSelection` to prevent selection changes while still rendering any provided `selectedItemIds`.

@### Selection intent

Use the `defaultSelectionIntent` prop (or controlled `selectionIntent`) to control how selected items are visually represented. By default, selected items appear highlighted ("keeping"). Set to "excluding" to render selected items with a strikethrough, indicating exclusion.

@reactCodeExample ListogramSelectionIntentExample

@### Selection toggles

Use the `showSelectionToggles` prop to render selection as checkboxes or radio buttons instead of background color.

@#### Background highlight

By default, selection is represented with a background color highlight.

@reactCodeExample ListogramSelectionToggleBackgroundExample

@#### Checkbox

Set `showSelectionToggles` to `true` with toggle or multiple selection to render checkboxes.

@reactCodeExample ListogramSelectionToggleCheckboxExample

@#### Radio button

Set `showSelectionToggles` to `true` with single selection to render radio buttons.

@reactCodeExample ListogramSelectionToggleRadioExample

@### Sorting

Set `enableSorts` to `true` to display a sort menu in the header. Use `defaultSortKind` and `defaultSortDirection` to set the initial sort.

@reactCodeExample ListogramSortingExample

@### Show bars

Use the `showBars` prop to toggle whether histogram bars appear alongside count values. Defaults to `true`.

@reactCodeExample ListogramShowBarsExample

@### Visible item limit

Use the `visibleItemLimit` prop to truncate the list and show a "View all" button. Use `defaultShowAllItems` to control the initial expanded state.

@reactCodeExample ListogramVisibleItemLimitExample

@### Value formatter

Use the `valueFormatter` prop to customize how count values are displayed.

@reactCodeExample ListogramValueFormatterExample

@### Count total

Use the `countTotal` prop to set a shared maximum for bar width scaling. This is useful when multiple Listograms should share the same visual scale for comparison.

@reactCodeExample ListogramCountTotalExample

@### With Popover

Wrap Listogram in a Popover to create a dropdown selection UI. Use `itemShouldDismissPopover` (defaults to `true`) to control whether clicking an item closes the popover.

@reactCodeExample ListogramPopoverExample

@### Disabled items

Set `disabled: true` on individual item objects to make them non-interactive.

@reactCodeExample ListogramDisabledItemsExample

@## Interactive Playground

@reactExample ListogramExample

@## Props interface

@interface ListogramProps
