---
reference: api
---

@# JavaScript API

The `Table`, `Column`, `Cell`, `ColumnHeaderCell`, `EditableName`, and `EditableCell`
components are available in the __@blueprintjs/table__ package.

@## Table

The top-level component of the table is `Table`. You must at least define the
number of rows (`numRows` prop) as well as a set of `Column` children.

@interface ITableProps

@### Instance methods

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

- `scrollToRegion(region: IRegion): void` &ndash; Scrolls the table to the target [region](#table/api.region) in a
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

@## Column

`Column` contains props for defining how the header and cells of that column
are rendered.

The table is designed to best support columnar data, meaning data where each column
has only one type of value (for example, strings, dates, currency amounts).
Because of this, the table's children are a list of `Column` components.

Use the `rowHeaderCellRenderer` prop of `Table` to define row headers.

@interface IColumnProps

@## Cell

The `Cell` component renders content in the table body. `Cell`s should be
returned from the `cellRenderer` method of each `Column`.

@interface ICellProps

@## ColumnHeaderCell

Customize how each column header is displayed.

The `columnHeaderCellRenderer` method on each `Column` should return a
`ColumnHeaderCell`. Children of a `ColumnHeaderCell` are rendered below
the name of the column. If you want to override the render behavior of the
name, you can supply a `nameRenderer` prop to the `ColumnHeaderCell`.

@interface IColumnHeaderCellProps

@## EditableName

Return a `EditableName` component from the `nameRenderer` prop on a
`ColumnHeaderCell` to enable click-to-edit functionality in the column
header.

@interface IEditableNameProps

@## EditableCell

Return a `EditableCell` component from the `cellRenderer` prop on a
`Column` to enable double-click-to-edit functionality in the table body.

@interface IEditableCellProps

@## Region

A region is a rectangular group of cells in the table.

Regions are typically used to describe boundaries for selections (via the
`selectedRegions` prop) and custom overlays (via the `styledRegionGroups` prop).
You may also wish to scroll directly to a region in the table via the
[`Table.scrollToRegion`](#table/api.instance-methods) instance method.

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


@## TruncatedFormat

Wrap your cell contents with a `TruncatedFormat` component like so:

```tsx
const content = "A very long string...";
return <Cell><TruncatedFormat>{content}</TruncatedFormat></Cell>
```

@interface ITruncatedFormatProps

@## JSONFormat

Wrap your JavaScript object cell contents with a `JSONFormat` component like so:

```tsx
const content = { any: "javascript variable", even: [null, "is", "okay", "too"] };
return <Cell><JSONFormat>{content}</JSONFormat></Cell>
```

@interface IJSONFormatProps
