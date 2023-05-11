---
reference: api
---

@# JavaScript API

The `Table`, `Column`, `Cell`, `ColumnHeaderCell2`, `EditableName`, and `EditableCell2`
components are available in the __@blueprintjs/table__ package.

@## Table

The top-level component of the table is `Table2`. You must at least define the
number of rows (`numRows` prop) as well as a set of `Column` children.

@interface Table2Props

@### Instance methods


@method Table.resizeRowsByTallestCell

@method Table.resizeRowsByApproximateHeight


`ICellMapper` is just a function that takes a cell-coordinate and returns a generic type:



```ts
type ICellMapper<T> = (rowIndex: number, columnIndex: number) => T;
```


@method Table.scrollToRegion

@method Table2.scrollByOffset

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

@## ColumnHeaderCell2

Optionally customize how each column header is displayed.

The `columnHeaderCellRenderer` method on each `Column` should return a
`ColumnHeaderCell2`. Children of a `ColumnHeaderCell2` are rendered below
the name of the column. If you want to override the render behavior of the
name, you can supply a `nameRenderer` prop to the `ColumnHeaderCell2`.

<div class="@ns-callout @ns-large @ns-intent-primary @ns-icon-info-sign">

<h5 class="@ns-heading">Additional CSS required</h5>

__ColumnHeaderCell2__ depends on @blueprintjs/popover2 styles, so you must remember to import
that package's stylesheet in your application in addition to `table.css`:

```scss
@import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
```
</div>

@interface IColumnHeaderCellProps

@## EditableName

Return a `EditableName` component from the `nameRenderer` prop on a
`ColumnHeaderCell2` to enable click-to-edit functionality in the column
header.

@interface IEditableNameProps

@## EditableCell2

Return an `EditableCell2` component from the `cellRenderer` prop on a
`Column` to enable double-click-to-edit functionality in the table body.

@interface EditableCell2Props

@## RowHeaderCell2

Optionally customize how each row header is displayed.

In order to use this API, supply a custom renderer function which returns a `RowHeaderCell2` to the
`rowHeaderCellRenderer` prop on the overall `Table2`.

<div class="@ns-callout @ns-large @ns-intent-primary @ns-icon-info-sign">

<h5 class="@ns-heading">Additional CSS required</h5>

__RowHeaderCell2__ depends on @blueprintjs/popover2 styles, so you must remember to import
that package's stylesheet in your application in addition to `table.css`:

```scss
@import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
```
</div>

@interface IRowHeaderCellProps

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

```ts
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

@method Regions.getRegionCardinality

@## TruncatedFormat2

Wrap your cell contents with a `TruncatedFormat2` component like so:

```tsx
const content = "A very long string...";
return <Cell><TruncatedFormat2>{content}</TruncatedFormat2></Cell>
```

@interface ITruncatedFormatProps

@## JSONFormat2

Wrap your JavaScript object cell contents with a `JSONFormat2` component like so:

```tsx
const content = { any: "javascript variable", even: [null, "is", "okay", "too"] };
return <Cell><JSONFormat2>{content}</JSONFormat2></Cell>
```

@interface IJSONFormatProps
