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
* Selecting cells and copying with the right-click context menu or with Cmd/Ctrl+C hotkeys

<div class="@ns-callout @ns-large @ns-intent-primary @ns-icon-info-sign">

This example utilizes `cellRendererDependencies`; [see why in the section below](#table/features.re-rendering-cells).
</div>

@reactExample TableSortableExample

@## Re-rendering cells

Sometimes you may need to re-render table cells based on new data or some user interaction,
like a sorting operation as demonstrated in the above example. In these cases, the typical
table props which tell the component to re-render (like `children`, `numRows`, `selectedRegions`, etc)
may not change, so the table will not re-run its `<Cell>` children render methods.

To work around this problem, `Table2` supports a dependency list in its `cellRendererDependencies` prop.
Dependency changes in this list (compared using shallow equality checks) trigger a re-render of
all cells in the table.

In the above sortable table example, we keep a `sortedIndexMap` value in state which is updated in
the column sort callback. This "map" is referenced in the cell renderers to determine which data to
render at each row index, so by including it as a dependency in `cellRendererDependencies`, we can
guarantee that cell renderers will be re-triggered after a sorting operation, and those renderers
will reference the up-to-date `sortedIndexMap` value.

@## Focused cell

You may allow users to focus on a single cell and navigate around the table with arrow keys
by setting `enableFocusedCell={true}`. Try out this interaction in the table above &mdash; the table
container will also scroll around if you move focus outside the current viewport. You can expand
and shrink the selected cell range using <kbd>Shift</kbd> + arrow keys. For a full reference of
enabled keyboard hotkeys, press <kbd>?</kbd> to bring up the hotkeys dialog after you have clicked
into the table once.

@## Editing

To make your table editable, use the [`EditableCell2`](#table/table2.editablecell2) and
`EditableName` components to create editable table cells and column names.

To further extend the interactivity of the column headers, you can
add children components to each `ColumnHeaderCell2` defined in the
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

`Cell`, `EditableCell2`, `ColumnHeaderCell2`, and `RowHeaderCell2` expose a `loading` prop for granular
control of which cells should show a loading state. Try selecting a different preset loading
configuration.

@reactExample CellLoadingExample

@## Formatting

To display long strings or native JavaScript objects, we provide
`<TruncatedFormat2>` and `<JSONFormat2>` components. These are designed to be used within a `<Cell>`,
where they will render a popover to show the full cell contents on click.

Below is a table of timezones including the local time when this page was
rendered. It uses a `<TruncatedFormat2 detectTruncation={true}>` component to show the long date string
and a `<JSONFormat2 detectTruncation={true}>` component to show the timezone info object.

<div class="@ns-callout @ns-large @ns-intent-primary @ns-icon-info-sign">

<h5 class="@ns-heading">Additional CSS required</h5>

These cell formatting components depend on @blueprintjs/popover2 styles, so you must remember to import
that package's stylesheet in your application in addition to `table.css`:

```scss
@import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
```
</div>

@reactExample TableFormatsExample

@## Freezing

The table supports column and row freezing via the `numFrozenColumns` and `numFrozenRows` props,
respectively. Passing `numFrozenColumns={n}` will freeze the `n` leftmost columns in place, while
all other columns remain scrollable. Likewise, passing `numFrozenRows={m}` will freeze the `m`
topmost rows in place, while all other rows remain scrollable.

Here's an example of a table with 1 frozen columns and 2 frozen rows:

@reactExample TableFreezingExample
