@# HTML table

__HTMLTable__ provides Blueprint styling to native HTML tables.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">This is not @blueprintjs/table</h5>

This component is a simple CSS-only skin for HTML `<table>` elements.
It is ideal for basic static tables. If you're looking for more complex
spreadsheet-like features, check out [**@blueprintjs/table**](#table).

</div>

@## Props interface

The `<HTMLTable>` component provides modifier props to apply styles to an HTML `<table>` element. Note that you are
responsible for rendering `<thead>` and `<tbody>` elements as children.

@interface HTMLTableProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<HTMLTable>`](#core/components/html-table)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Apply the `@ns-html-table` class to a `<table>` element. You can apply modifiers as additional classes.

@css html-table
