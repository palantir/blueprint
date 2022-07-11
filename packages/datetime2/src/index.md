---
reference: datetime2
---

@# Datetime2

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Experimental Library</h4>
    <p>This package is currently in the v0.x version range, which means its API is unstable.</p>
</div>

The [__@blueprintjs/datetime2__ package](https://www.npmjs.com/package/@blueprintjs/datetime2)
provides components for interacting with dates, times, and timezones:

- [DateInput2](#datetime2/date-input2) renders a date input with
    an optional embedded [TimezoneSelect](#datetime2/timezone-select).
- [DateRangeInput2](#datetime2/date-range-input2) renders a date range input with
    an optional [TimezoneSelect](#datetime2/timezone-select).
- [TimezoneSelect](#datetime2/timezone-select) renders a [Select2](#select/select2)
  with a list of timezones for the user to choose from.

### Motivation

These are modern "V2" variants of components available in the
[__@blueprintjs/datetime__](#datetime) and [__@blueprintjs/timezone__](#timezone) packages.
They will become the standard date & time components in a future major version of Blueprint
in 2022. You are encouraged to try out the new APIs, provide feedback, and set yourself up
for forward compatibility in the Blueprint ecosystem.

Compared to their "V1" counterparts, these components:
- use [Popover2](#popover2-package/popover2) instead of [Popover](#core/components/popover)
  under the hood
- have better timezone awareness because they do not rely on JS `Date` APIs which are lossy
  when it comes to timezone information
- utilize lightweight third-pary dependencies ([date-fns](https://date-fns.org/) and
  [date-fns-tz](https://github.com/marnusw/date-fns-tz)) for manipulating dates and displaying
  the list of available timezones
- no longer suggest using the [deprecated moment.js library](https://momentjs.com/docs/#/-project-status/)
- do NOT support Internet Explorer

### Installation

Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```sh
npm install --save @blueprintjs/datetime2
```

Import the package stylesheet in Sass:

```scss
@import "~@blueprintjs/datetime2/lib/css/blueprint-datetime2.css";
```

...or in plain HTML:

```html
<link href="path/to/node_modules/@blueprintjs/datetime2/lib/css/blueprint-datetime2.css" rel="stylesheet" />
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Additional CSS required</h4>

This library still relies on some components from `@blueprintjs/datetime`, so you will need to pull in that
package's CSS as well. Make sure to add this import:

```scss
@import "~@blueprintjs/datetime/lib/css/blueprint-datetime.css"`;
```
</div>

@page date-input2
@page date-range-input2
@page timezone-select
