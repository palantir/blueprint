---
reference: table-js
---

@# Table

A highly interactive React `Table` component.

<div class="pt-callout pt-large pt-intent-primary pt-icon-info-sign">
  If you are looking instead for the Blueprint-styled HTML table, see
  [`.pt-table` in **@blueprintjs/core**](#core/components/table).
</div>

### Features

* High-scale, data-agnostic
* Customizable cell and header rendering
* Virtualized viewport rendering
* Selectable rows, columns and cells
* Resizable rows and columns
* Editable headers and cells
* Integrated header and context menus

@## Installation

```sh
npm install --save @blueprintjs/core @blueprintjs/table
```

@## Basic usage

To create a table, you must define the rows and columns. Add children to the `Table` to create columns,
and change the `numRows` prop on the `Table` to set the number of rows.

For example, this code creates an empty table with three columns and five rows:

```tsx
<Table numRows={5}>
    <Column />
    <Column />
    <Column />
</Table>
```

The table is **data-agnostic**. It doesn't store any data internally, so it is up to you to bind the table to your data.

You can specify how the data is displayed by defining the `renderCell` prop on each `Column` component.
This is useful when working with typed columnar data, like database results.

For example, this creates a table that renders dollar values:

```tsx
const renderCell = (rowIndex: number) => {
    return <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>
};
<Table numRows={10}>
    <Column name="Dollars" renderCell={renderCell}/>
</Table>
```

@reactExample TableDollarExample

@## Features

@### Sorting

Because the table is **data-agnostic**, you can display complex data in the
table and perform arbitrary operations on it.

For example, this data set of Sumo tournaments in 2015 contains rankings and
win-tie-loss results for each competing rikishi (wrestler). For each column
type, we define a different set of sort operations.

In the table below, try:
* Sorting with the menu in each column header
* Selecting cells and copying with the right-click context menu

@reactExample TableSortableExample

@### Editing

To make your table editable, use the `EditableCell` and
`EditableName` components to create editable table cells and column names.

To further extend the interactivity of the column headers, you can
add children components to each `ColumnHeaderCell` defined in the
`renderColumnHeader` prop of `Column`.

The following example renders a table with editable column names (single
click), editable table cells (double click), and selectable column types. In
this example, the editable values are validated against an alpha character-only
regular expression (`[a-zA-Z]`). If the content is invalid, a
`Intent.DANGER` style is applied to the cell.

@reactExample TableEditableExample

@### Reordering

The table supports column and row reordering via the `isColumnReorderable` and `isRowReorderable`
props, respectively. The table also requires the `FULL_COLUMNS` selection mode to be enabled for
column reordering and the `FULL_ROWS` selection mode to be enabled for row reordering; these can be
set via the `selectionModes` prop.

To reorder a single row or column, first click its header cell to select it, then click and drag the
header cell again to move it elsewhere. Likewise, to reorder multiple consecutive rows or columns at
once, click and drag across multiple header cells to select the range, then click and drag anywhere in
the selected header cells to move them as a group.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Column reordering with interaction bar enabled</h5>
    When the interaction bar is enabled, the table will show handle icons in the interaction bar that
    you can drag directly without having to make a selection first.
</div>

@reactExample TableReorderableExample

@### Loading states

When fetching or updating data, it may be desirable to show a loading state. The table components
provide fine-grain loading control of loading row headers, column headers, or individual cells.
Several table components expose a `loading` or `loadingOptions` prop, but loading-related rendering
is computed with components lower in the hierarchy taking priority. For example, a cell with
`loading` set to `false` will never render its loading state even if the `Column` component to which
it belongs has a `loadingOptions` value of `[ ColumnLoadingOption.CELLS ]`. The following examples
display a table of the largest potentially hazardous asteroid (based on absolute magnitude)
discovered in a given year.

@#### Table loading states

`Table` exposes a `loadingOptions` prop that allows you to control the loading state behavior of all
column header, row header, and body cells. Try toggling the different options.

@reactExample TableLoadingExample

@#### Column loading states

`Column` exposes a `loadingOptions` prop that allows you to control the loading state behavior of an
individual column's header and body cells. Try selecting a different column in the dropdown below.

@reactExample ColumnLoadingExample

@#### Cells

`Cell`, `EditableCell`, `ColumnHeaderCell`, and `RowHeaderCell` expose a `loading` prop for granular
control of which cells should show a loading state. Try selecting a different preset loading
configuration.

@reactExample CellLoadingExample

@### Formatting

To display long strings or native JavaScript objects, we provide
`<TruncatedFormat>` and `<JSONFormat>` components, which are designed to be used
within a `<Cell>`.

Below is a table of timezones including the local time when this page was
rendered. It uses a `<TruncatedFormat>` component to show the long date string
and a `<JSONFormat>` component to show the timezone info object.

@reactExample TableFormatsExample

@## JavaScript API

The `Table`, `Column`, `Cell`, `ColumnHeaderCell`, `EditableName`, and `EditableCell`
components are available in the __@blueprintjs/table__ package.

@### Table

The top-level component of the table is `Table`. You must at least define the
number of rows (`numRows` prop) as well as a set of `Column` children.

@interface ITableProps

@### Column

`Column` contains props for defining how the header and cells of that column
are rendered.

The table is designed to best support columnar data, meaning data where each column
has only one type of value (for example, strings, dates, currency amounts).
Because of this, the table's children are a list of `Column` components.

Use the `renderRowHeaderCell` prop of `Table` to define row headers.

@interface IColumnProps

@### Cell

The `Cell` component renders content in the table body. `Cell`s should be
returned from the `renderCell` method of each `Column`.

@interface ICellProps

@### ColumnHeaderCell

Customize how each column header is displayed.

The `renderColumnHeaderCell` method on each `Column` should return a
`ColumnHeaderCell`. Children of a `ColumnHeaderCell` are rendered below
the name of the column. If you want to override the render behavior of the
name, you can supply a `renderName` prop to the `ColumnHeaderCell`.

@interface IColumnHeaderCellProps

@### EditableName

Return a `EditableName` component from the `renderName` prop on a
`ColumnHeaderCell` to enable click-to-edit functionality in the column
header.

@interface IEditableNameProps

@### EditableCell

Return a `EditableCell` component from the `renderCell` prop on a
`Column` to enable double-click-to-edit functionality in the table body.

@interface IEditableCellProps

@### TruncatedFormat

Wrap your cell contents with a `TruncatedFormat` component like so:

```tsx
const content = "A very long string...";
return <Cell><TruncatedFormat>{content}</TruncatedFormat></Cell>
```

@interface ITruncatedFormatProps

@### JSONFormat

Wrap your JavaScript object cell contents with a `JSONFormat` component like so:

```tsx
const content = { any: "javascript variable", even: [null, "is", "okay", "too"] };
return <Cell><JSONFormat>{content}</JSONFormat></Cell>
```

@interface IJSONFormatProps
