---
reference: datetime
---

@# Datetime

The [__@blueprintjs/datetime__ package](https://www.npmjs.com/package/@blueprintjs/datetime)
provides React components for interacting with dates and times:

- [DatePicker](#datetime/datepicker) for selecting a single date (day, month, year).

- [DateRangePicker](#datetime/daterangepicker) for selecting date ranges.

- [TimePicker](#datetime/timepicker) for selecting a time (hour, minute, second, millisecond).

- [DateTimePicker](#datetime/datetimepicker), which composes DatePicker and
    TimePicker to select a date and time together (DEPRECATED).

- [DateInput](#datetime/dateinput), which composes a text input with a DatePicker in
    a Popover, for use in forms (DEPRECATED).

- [DateRangeInput](#datetime/daterangeinput), which composes two text inputs with a
    DateRangePicker in a Popover, for use in forms.

Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```sh
npm install --save @blueprintjs/datetime
```

Import the package stylesheet in Sass:

```scss
@import "~@blueprintjs/datetime/lib/css/blueprint-datetime.css";
```

...or in plain HTML:

```html
<link href="path/to/node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css" rel="stylesheet" />
```

@page datepicker
@page daterangepicker
@page timepicker
@page datetimepicker
@page dateinput
@page daterangeinput
