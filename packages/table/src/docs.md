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

The table supports drag-reordering of columns and rows via the `isColumnReorderable` and `isRowReorderable`
props, respectively.

#### Reordering columns

When `isColumnReorderable={true}`, a drag handle will appear in the column header (or in the
interaction bar, if `useInteractionBar={true}`).

##### Single column

To reorder a single column, click and drag the desired column's drag handle to the left or right,
then release. This will work whether or not column selection is enabled.

##### Multiple columns

To allow reordering of multiple contiguous columns at once, first set the following additional
props:

- `allowMultipleSelection={true}`
- `selectionModes={[RegionCardinality.FULL_COLUMNS, ...]}`

Then drag-select the desired columns into a single selection, and grab any selected column's drag
handle to reorder the entire selected block.

##### Edge cases

With disjoint column selections (specified via <kbd>Cmd</kbd> or <kbd>Ctrl</kbd> + click),
only the selection containing the target drag handle will be reordered. All other
selections will be cleared afterward.

Reordering a column contained in two overlapping selections will currently result in undefined
behavior.

#### Reordering rows

Rows do not have a drag handle, so they must be selected before reordering. To reorder a selection
of one or more rows, simply click and drag anywhere in a selected row header, then release. Note
that the following props must be set for row reordering to work:

- `isRowHeaderShown={true}`
- `isRowReorderable={true}`
- `selectionModes={[RegionCardinality.FULL_ROWS, ...]}`
- `allowMultipleSelection={true}` (to optionally enable multi-row reordering)

#### Example

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

@### Freezing

The table supports column and row freezing via the `numFrozenColumns` and `numFrozenRows` props,
respectively. Passing `numFrozenColumns={n}` will freeze the `n` leftmost columns in place, while
all other columns remain scrollable. Likewise, passing `numFrozenRows={m}` will freeze the `m`
topmost rows in place, while all other rows remain scrollable.

Here's an example of a table with 1 frozen columns and 2 frozen rows:

@reactExample TableFreezingExample

@## JavaScript API

The `Table`, `Column`, `Cell`, `ColumnHeaderCell`, `EditableName`, and `EditableCell`
components are available in the __@blueprintjs/table__ package.

@### Table

The top-level component of the table is `Table`. You must at least define the
number of rows (`numRows` prop) as well as a set of `Column` children.

@#### Instance methods

- `resizeRowsByTallestCell(columnIndices?: number | number[]): void` &ndash; Resizes all rows in the
    table to the height of the tallest visible cell in the specified columns. If no indices are
    provided, defaults to using the tallest visible cell from all columns in view.
- `resizeRowsByApproximateHeight(getCellText?: ICellMapper<string>, options?: IResizeRowsByApproximateHeightOptions)`
    &ndash; __Experimental!__ Resizes every row in the table to fit its
    maximum-height cell content. Since rows in view are the only ones present in
    the DOM, this method merely _approximates_ the height of cell content based
    on average letter width and line height.

    This has two implications: (1) results are best when each cell contains plain
    text with an internally consistent style, and (2) results may not be perfect.

    Approximation parameters can be configured for the entire table or on a
    per-cell basis. Default values are fine-tuned to work well with default
    `Table` font styles. Here are the available options:

    ```tsx
interface IResizeRowsByApproximateHeightOptions {
    /**
     * Approximate width (in pixels) of an average character of text.
     */
    getApproximateCharWidth?: number | ICellMapper<number>;

    /**
     * Approximate height (in pixels) of an average line of text.
     */
    getApproximateLineHeight?: number | ICellMapper<number>;

    /**
     * Sum of horizontal paddings (in pixels) from the left __and__ right sides
     * of the cell.
     */
    getCellHorizontalPadding?: number | ICellMapper<number>;

    /**
     * Number of extra lines to add in case the calculation is imperfect.
     */
    getNumBufferLines?: number | ICellMapper<number>;
}
    ```

    `ICellMapper` is just a function that takes a cell-coordinate and returns a generic type:

    ```tsx
    type ICellMapper<T> = (rowIndex: number, columnIndex: number) => T;
    ```

- `scrollToRegion(region: IRegion): void` &ndash; Scrolls the table to the target [region](#table-js.region) in a
   fashion appropriate to the target region's cardinality:
    - `CELLS`: Scroll the top-left cell in the target region to the top-left corner of the viewport.
    - `FULL_ROWS`: Scroll the top-most row in the target region to the top of the viewport.
    - `FULL_COLUMNS`: Scroll the left-most column in the target region to the left side of the viewport.
    - `FULL_TABLE`: Scroll the top-left cell in the table to the top-left corner of the viewport.

  If there are active frozen rows and/or columns, the target region will be positioned in the top-left
  corner of the non-frozen area (unless the target region itself is in the frozen area).

  If the target region is close to the bottom-right corner of the table, this function will simply
  scroll the target region as close to the top-left as possible until the bottom-right corner is
  reached.

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

@### Region

A region is a rectangular group of cells in the table.

Regions are typically used to describe boundaries for selections (via the
`selectedRegions` prop) and custom overlays (via the `styledRegionGroups` prop).
You may also wish to scroll directly to a region in the table via the
[`Table.scrollToRegion`](#table-js.instance-methods) instance method.

There are four different types of regions:
- __Cell region:__ contains a finite, rectangular group of table cells
- __Row region:__ represents all cells within one or more consecutive rows
- __Column region:__ represents all cells within one or more consecutive columns
- __Table region:__ represents all cells in the table

Regions are defined in code according to the `IRegion` interface:

@interface IRegion

You can construct region objects manually according to this interface, but we
recommend using our exported __factory methods__ to help you construct the
appropriate schema for your desired region type:

```tsx
import { Regions } from "@blueprintjs/table";

const singleCellRegion   = Regions.cell(0, 0); // { rows: [0, 0], cols: [0, 0] }
const singleColumnRegion = Regions.column(0);  // { rows: null, cols: [0, 0] }
const singleRowRegion    = Regions.row(0);     // { rows: [0, 0], cols: null }

const multiCellRegion   = Regions.cell(0, 0, 2, 2); // { rows: [0, 2], cols: [0, 2] }
const multiColumnRegion = Regions.column(0, 2);     // { rows: null, cols: [0, 2] }
const multiRowRegion    = Regions.row(0, 2);        // { rows: [0, 2], cols: null }

const tableRegion = Regions.table(); // { rows: null, cols: null }
```

The __@blueprintjs/table__ package also exports a `RegionCardinality`
enumeration to describe the various region types in code:
- `RegionCardinality.CELLS`: describes a cell region
- `RegionCardinality.FULL_ROWS`: describes a row region
- `RegionCardinality.FULL_COLUMNS`: describes a column region
- `RegionCardinality.FULL_TABLE`: describes a table region

This enumeration is primarily used with the `selectionModes` prop to inform the
`Table` which kinds of regions are selectable:

```tsx
import { RegionCardinality } from "@blueprintjs/table";

// disables selection of all region types
<Table selectionModes={[]} />

// enables selection of cell regions only
<Table selectionModes={[RegionCardinality.CELLS]} />

// enables selection of cell and row regions only
<Table selectionModes={[RegionCardinality.CELLS, RegionCardinality.FULL_ROWS]} />

// enables selection of the full table only
<Table selectionModes={[RegionCardinality.FULL_TABLE]} />
```

You may also use the exported `SelectionModes` enumeration to express common
selection-mode combinations more concisely:

```tsx
import { SelectionModes } from "@blueprintjs/table";

<Table selectionModes={SelectionModes.ALL} />
<Table selectionModes={SelectionModes.COLUMNS_AND_CELLS} />
<Table selectionModes={SelectionModes.COLUMNS_ONLY} />
<Table selectionModes={SelectionModes.NONE} />
<Table selectionModes={SelectionModes.ROWS_AND_CELLS} />
<Table selectionModes={SelectionModes.ROWS_ONLY} />
```

Every region object has a well-defined cardinality. If necessary, you can
determine the cardinality of any region using the exported
`Regions.getRegionCardinality` function:

```tsx
import { Regions } from "@blueprintjs/table";

const cardinalities = [
    Regions.getRegionCardinality(Regions.cell(0, 0)), // RegionCardinality.CELLS
    Regions.getRegionCardinality(Regions.row(0)),     // RegionCardinality.FULL_ROWS
    Regions.getRegionCardinality(Regions.column(0)),  // RegionCardinality.FULL_COLUMNS
    Regions.getRegionCardinality(Regions.table()),    // RegionCardinality.FULL_TABLE
];
```


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
