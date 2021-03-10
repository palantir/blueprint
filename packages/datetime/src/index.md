---
reference: datetime
---

@# Datetime

The [__@blueprintjs/datetime__ NPM package](https://www.npmjs.com/package/@blueprintjs/datetime)
provides several components for interacting with dates and times:

- [`DatePicker`](#datetime/datepicker) for selecting a single date (day, month, year).

- [`DateRangePicker`](#datetime/daterangepicker) for selecting date ranges.

- [`TimePicker`](#datetime/timepicker) for selecting a time (hour, minute, second,
  millisecond).

- [`DateInput`](#datetime/dateinput), which composes a text input with a `DatePicker` in
  a `Popover`, for use in forms.

- [`DateRangeInput`](#datetime/daterangeinput), which composes two text inputs with a `DateRangePicker` in
  a `Popover`, for use in forms.

Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```sh
npm install --save @blueprintjs/datetime
```

Import CSS with a JS bundler like webpack:

```js
@import "~@blueprintjs/datetime/lib/css/blueprint-datetime.css";
```

...or in plain HTML:

```html
<link href="path/to/node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css" rel="stylesheet" />
```

@page datepicker
@page daterangepicker
@page timepicker
@page dateinput
@page daterangeinput
