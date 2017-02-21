@# Table (HTML)

This component adds Blueprint styling to native HTML tables.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
<h5>This is not @blueprintjs/table</h5>
This table component is a simple CSS-only skin for HTML `<table>` elements.
It is ideal for basic static tables. If you're looking for more complex
spreadsheet-like features, check out [**@blueprintjs/table**](#components.table-js).
</div>

@## CSS API

Apply the `pt-table` class to a `<table>` element. You can apply modifiers as additional classes.

Markup:
<table class="pt-table {{.modifier}}">
<thead>
<th>Project</th>
<th>Description</th>
<th>Technologies</th>
</thead>
<tbody>
<tr>
<td>Blueprint</td>
<td>CSS framework and UI toolkit</td>
<td>Sass, TypeScript, React</td>
</tr>
<tr>
<td>TSLint</td>
<td>Static analysis linter for TypeScript</td>
<td>TypeScript</td>
</tr>
<tr>
<td>Plottable</td>
<td>Composable charting library built on top of D3</td>
<td>SVG, TypeScript, D3</td>
</tr>
</tbody>
</table>

.pt-condensed - Condensed appearance
.pt-striped   - Striped appearance
.pt-bordered  - Bordered appearance
.pt-interactive  - Enables hover styles on rows
