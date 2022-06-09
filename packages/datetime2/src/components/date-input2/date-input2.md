---
tag: new
---

@# DateInput2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [DateInput](#datetime/dateinput)?

</h4>

DateInput2 is a replacement for the [DateInput component](#datetime/dateinput) from
[__@blueprintjs/datetime__ package](#datetime) and will replace it in Blueprint v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [migration guide](https://github.com/palantir/blueprint/wiki/DateInput2,-TimezonePicker2-migration)
on the wiki.

</div>

The `DateInput2` component is a [date input](#core/datetime/date-input) with
an embedded time zone selector.

@reactExample DateInput2Example

@## Date formatting

`DateInput2` requires two props for parsing and formatting dates:

- `formatDate(date, locale?)` receives the current `Date` and returns a string representation of it. The result of this function becomes the input value when it is not being edited.
- `parseDate(str, locale?)` receives text inputted by the user and converts it to a `Date` object. The returned `Date` becomes the next value of the component.

Unlike the `DateInput` component, this component uses ISO strings to represent time and also returns that type in the `onChange` callback.

The optional `locale` argument is the value of the `locale` prop.

A simple implementation using built-in browser methods could look like this:

```tsx
import { DateFormatProps DateInput2 } from "@blueprintjs/datetime2";

const jsDateFormatter: DateFormatProps = {
    // note that the native implementation of Date functions differs between browsers
    formatDate: date => date.toLocaleDateString(),
    parseDate: str => new Date(str),
    placeholder: "M/D/YYYY",
};

<DateInput2 {...jsDateFormatter} />
```


@## Props

Use the `onChange` function to listen for changes to the selected date. Use
`onError` to listen for invalid entered dates.

You can control the selected date by setting the `value` prop, or use the
component in uncontrolled mode and specify an initial date by setting
`defaultValue`.

Customize the date format in the input with the required `formatDate` and `parseDate`
callbacks.

```tsx
import { DateInput2 } from "@blueprintjs/datetime2";

<DateInput2
    formatDate={date => date.toLocaleString()}
    onChange={this.handleDateChange}
    parseDate={str => new Date(str)}
    placeholder={"M/D/YYYY"}
    value={this.state.date}
/>
```

@interface DateInput2Props

@## Localization

See the [Date picker localization docs](#datetime/datepicker.localization).
