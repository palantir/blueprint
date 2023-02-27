@# Table

The [__@blueprintjs/table__ package](https://www.npmjs.com/package/@blueprintjs/table) provides components
to build a highly interactive table or spreadsheet UI.

<div class="@ns-callout @ns-large @ns-intent-primary @ns-icon-info-sign">

If you are looking for the simpler Blueprint-styled HTML `<table>` instead, see
[the `HTMLTable` component in **@blueprintjs/core**](#core/components/html-table).
</div>

Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```sh
npm install --save @blueprintjs/table
```

Do not forget to include `table.css` on your page:

```scss
@import "@blueprintjs/table/lib/css/table.css";
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">

<h5 class="@ns-heading">Additional CSS required</h5>

__ColumnHeaderCell2__, __JSONFormat2__, and __TruncatedFormat2__ (available since @blueprintjs/table v4.6.0)
depend on @blueprintjs/popover2 styles, so you must also import this CSS file for those components
to display properly:

```scss
@import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
```
</div>

### Features

* High-scale, data-agnostic
* Customizable cell and header rendering
* Virtualized viewport rendering
* Selectable rows, columns and cells
* Resizable rows and columns
* Editable headers and cells
* Integrated header and context menus

@## Basic usage

<div class="@ns-callout @ns-large @ns-intent-success @ns-icon-star">

There is an updated version of the table component with some new features and compatibility with the
[new hotkeys API](#core/components/hotkeys-target2): see [Table2](#table/table2).
</div>

To create a table, you must define the rows and columns. Add children to the `Table` to create columns,
and change the `numRows` prop on the `Table` to set the number of rows.

For example, this code creates an empty table with three columns and five rows:

```tsx
import { Column, Table } from "@blueprintjs/table";

<Table numRows={5}>
    <Column />
    <Column />
    <Column />
</Table>
```

The table is **data-agnostic**. It doesn't store any data internally, so it is up to you to bind the table to your data.

You can specify how the data is displayed by defining the `cellRenderer` prop on each `Column` component.
This is useful when working with typed columnar data, like database results.

For example, this creates a table that renders dollar and euro values:

```tsx
import { Cell, Column, Table } from "@blueprintjs/table";

const dollarCellRenderer = (rowIndex: number) => (
    <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>
);
const euroCellRenderer = (rowIndex: number) => (
    <Cell>{`€${(rowIndex * 10 * 0.85).toFixed(2)}`}</Cell>
);

<Table numRows={10}>
    <Column name="Dollars" cellRenderer={dollarCellRenderer}/>
    <Column name="Euros" cellRenderer={euroCellRenderer} />
</Table>
```

@reactExample TableDollarExample

@page table2
@page features
@page api
