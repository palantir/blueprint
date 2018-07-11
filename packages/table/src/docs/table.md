@# Table

A highly interactive React `Table` component.

<div class="@ns-callout @ns-large @ns-intent-primary @ns-icon-info-sign">
  If you are looking instead for the Blueprint-styled HTML `<table>`, see
  [`HTMLTable` in **@blueprintjs/core**](#core/components/html-table).
</div>

### Features

* High-scale, data-agnostic
* Customizable cell and header rendering
* Virtualized viewport rendering
* Selectable rows, columns and cells
* Resizable rows and columns
* Editable headers and cells
* Integrated header and context menus

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

You can specify how the data is displayed by defining the `cellRenderer` prop on each `Column` component.
This is useful when working with typed columnar data, like database results.

For example, this creates a table that renders dollar values:

```tsx
const cellRenderer = (rowIndex: number) => {
    return <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>
};
<Table numRows={10}>
    <Column name="Dollars" cellRenderer={cellRenderer}/>
</Table>
```

@reactExample TableDollarExample

@page features
@page api
