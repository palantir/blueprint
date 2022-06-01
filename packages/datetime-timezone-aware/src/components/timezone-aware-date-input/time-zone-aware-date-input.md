@# Time Zone Aware Date Input

The `TimezoneAwareDateInput` component is a [date input](#core/datetime/date-input) with an additional time zone selector.

@reactExample TimezoneAwareDateInputExample

@## Date formatting

`TimezoneAwareDateInput` requires as `DateInput` two props for parsing and formatting dates in the `DateInput`.

- `formatDate(date, locale?)` receives the current `Date` and returns a string representation of it. The result of this function becomes the input value when it is not being edited.
- `parseDate(str, locale?)` receives text inputted by the user and converts it to a `Date` object. The returned `Date` becomes the next value of the component.

Unlike the `DateInput` component, this component uses ISO strings to represent time and also returns that in the change handler.

The optional `locale` argument is the value of the `locale` prop.

A simple implementation using built-in browser methods could look like this:

```tsx
import { IDateFormatProps } from "@blueprintjs/datetime";
import { TimezoneAwareDateInput } from "@blueprintjs/datetime-timezone-aware";

const jsDateFormatter: IDateFormatProps = {
    // note that the native implementation of Date functions differs between browsers
    formatDate: date => date.toLocaleDateString(),
    parseDate: str => new Date(str),
    placeholder: "M/D/YYYY",
};

<TimezoneAwareDateInput {...jsDateFormatter} />
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
import { TimezoneAwareDateInput } from "@blueprintjs/datetime-timezone-aware";

<DateInput
    formatDate={date => date.toLocaleString()}
    onChange={this.handleDateChange}
    parseDate={str => new Date(str)}
    placeholder={"M/D/YYYY"}
    value={this.state.date}
/>
```

@interface ITimezoneAwareDateInputProps

@## Localization

See the [Date picker localization docs](#datetime/datepicker.localization).
