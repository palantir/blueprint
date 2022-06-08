---
reference: datetime2
---

@# Datetime2

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Experimental Library</h4>
    <p>This package is currently in the v0.x version range, which means its API may break frequently.</p>
</div>

The [__@blueprintjs/datetime2__ NPM package](https://www.npmjs.com/package/@blueprintjs/datetime)
provides components for interacting with dates, times, and timezones:

- [`DateInput2`](#datetime2/date-input2), which renders a [`DateInput`](#datetime/dateinput)
  with an embedded [`TimezonePicker2`](#datetime2/timezone-picker2) and shows the user's
  selected time zone.
- [`TimezonePicker2`](#datetime2/timezone-picker2), which renders a [`Select2`](#select/select2)
  with a list of timezones for the user to choose from.

### Motivation

These are modern variants of the components available in the
[`@blueprintjs/datetime` package](#datetime); they will become the standard date & time
components in a future major version of Blueprint.

Compared to their "V1" counterparts, these components:
- use [Popover2](#popover2-package/popover2) instead of [Popover](#core/components/popover)
  under the hood
- have better timezone awareness
- utilize lightweight dependencies for manipulating dates and displaying
  the list of available timezones
- no longer use the [deprecated moment.js library](https://momentjs.com/docs/#/-project-status/)

### Installation

Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```sh
npm install --save @blueprintjs/datetime2
```

Import CSS with a JS bundler like webpack:

```js
@import "~@blueprintjs/datetime2/lib/css/blueprint-datetime.css";
```

...or in plain HTML:

```html
<link href="path/to/node_modules/@blueprintjs/datetime2/lib/css/blueprint-datetime.css" rel="stylesheet" />
```

@page date-input2
@page timezone-picker2
