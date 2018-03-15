---
reference: features
---

@# Table features

@## Sorting

Because the table is **data-agnostic**, you can display complex data in the
table and perform arbitrary operations on it.

For example, this data set of Sumo tournaments in 2015 contains rankings and
win-tie-loss results for each competing rikishi (wrestler). For each column
type, we define a different set of sort operations.

In the table below, try:
* Sorting with the menu in each column header
* Selecting cells and copying with the right-click context menu

@reactExample TableSortableExample

@## Editing

To make your table editable, use the `EditableCell` and
`EditableName` components to create editable table cells and column names.

To further extend the interactivity of the column headers, you can
add children components to each `ColumnHeaderCell` defined in the
`columnHeaderCellRenderer` prop of `Column`.

The following example renders a table with editable column names (single
click), editable table cells (double click), and selectable column types. In
this example, the editable values are validated against an alpha character-only
regular expression (`[a-zA-Z]`). If the content is invalid, a
`Intent.DANGER` style is applied to the cell.

@reactExample TableEditableExample

@## Reordering

The table supports drag-reordering of columns and rows via the `enableColumnReordering` and `enableRowReordering`
props, respectively.

### Reordering columns

When `enableColumnReordering={true}`, a drag handle will appear in the column header (or in the
interaction bar, if `enableColumnInteractionBar={true}`).

#### Single column

To reorder a single column, click and drag the desired column's drag handle to the left or right,
then release. This will work whether or not column selection is enabled.

#### Multiple columns

To allow reordering of multiple contiguous columns at once, first set the following additional
props:

- `enableMultipleSelection={true}`
- `selectionModes={[RegionCardinality.FULL_COLUMNS, ...]}`

Then drag-select the desired columns into a single selection, and grab any selected column's drag
handle to reorder the entire selected block.

#### Edge cases

With disjoint column selections (specified via <kbd>Cmd</kbd> or <kbd>Ctrl</kbd> + click),
only the selection containing the target drag handle will be reordered. All other
selections will be cleared afterward.

Reordering a column contained in two overlapping selections will currently result in undefined
behavior.

### Reordering rows

Rows do not have a drag handle, so they must be selected before reordering. To reorder a selection
of one or more rows, simply click and drag anywhere in a selected row header, then release. Note
that the following props must be set for row reordering to work:

- `enableRowHeader={true}`
- `enableRowReordering={true}`
- `selectionModes={[RegionCardinality.FULL_ROWS, ...]}`
- `enableMultipleSelection={true}` (to optionally enable multi-row reordering)

### Example

@reactExample TableReorderableExample

@## Loading states

When fetching or updating data, it may be desirable to show a loading state. The table components
provide fine-grain loading control of loading row headers, column headers, or individual cells.
Several table components expose a `loading` or `loadingOptions` prop, but loading-related rendering
is computed with components lower in the hierarchy taking priority. For example, a cell with
`loading` set to `false` will never render its loading state even if the `Column` component to which
it belongs has a `loadingOptions` value of `[ ColumnLoadingOption.CELLS ]`. The following examples
display a table of the largest potentially hazardous asteroid (based on absolute magnitude)
discovered in a given year.

@### Table loading states

`Table` exposes a `loadingOptions` prop that allows you to control the loading state behavior of all
column header, row header, and body cells. Try toggling the different options.

@reactExample TableLoadingExample

@### Column loading states

`Column` exposes a `loadingOptions` prop that allows you to control the loading state behavior of an
individual column's header and body cells. Try selecting a different column in the dropdown below.

@reactExample ColumnLoadingExample

@### Cells

`Cell`, `EditableCell`, `ColumnHeaderCell`, and `RowHeaderCell` expose a `loading` prop for granular
control of which cells should show a loading state. Try selecting a different preset loading
configuration.

@reactExample CellLoadingExample

@## Formatting

To display long strings or native JavaScript objects, we provide
`<TruncatedFormat>` and `<JSONFormat>` components, which are designed to be used
within a `<Cell>`.

Below is a table of timezones including the local time when this page was
rendered. It uses a `<TruncatedFormat>` component to show the long date string
and a `<JSONFormat>` component to show the timezone info object.

@reactExample TableFormatsExample

@## Freezing

The table supports column and row freezing via the `numFrozenColumns` and `numFrozenRows` props,
respectively. Passing `numFrozenColumns={n}` will freeze the `n` leftmost columns in place, while
all other columns remain scrollable. Likewise, passing `numFrozenRows={m}` will freeze the `m`
topmost rows in place, while all other rows remain scrollable.

Here's an example of a table with 1 frozen columns and 2 frozen rows:

@reactExample TableFreezingExample
