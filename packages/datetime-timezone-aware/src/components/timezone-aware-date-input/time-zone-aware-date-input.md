@# Time Zone Aware Date Input

The `TimeZoneAwareDateInput` component is a [date input](#core/datetime/date-input) with an additional time zone selector.

@reactExample TimeZoneAwareDateInputExample

@## Date formatting

`TimeZoneAwareDateInput` requires as `DateInput` two props for parsing and formatting dates in the `DateInput`.

- `formatDate(date, locale?)` receives the current `Date` and returns a string representation of it. The result of this function becomes the input value when it is not being edited.
- `parseDate(str, locale?)` receives text inputted by the user and converts it to a `Date` object. The returned `Date` becomes the next value of the component.

Unlike the `DateInput` component, this component uses ISO strings to represent time and also returns that in the change handler.

The optional `locale` argument is the value of the `locale` prop.

A simple implementation using built-in browser methods could look like this:

```tsx
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";

const jsDateFormatter: IDateFormatProps = {
    // note that the native implementation of Date functions differs between browsers
    formatDate: date => date.toLocaleDateString(),
    parseDate: str => new Date(str),
    placeholder: "M/D/YYYY",
};

<DateInput {...jsDateFormatter} />
```

An implementation using `moment.js` could look like this:

```tsx
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";
import moment from "moment";

function getMomentFormatter(format: string): IDateFormatProps {
    // note that locale argument comes from locale prop and may be undefined
    return {
        formatDate: (date, locale) => moment(date).locale(locale).format(format),
        parseDate: (str, locale) => moment(str, format).locale(locale).toDate(),
        placeholder: format,
    }
};

<DateInput {...getMomentFormatter("LL")} locale="de" />
```

@## Props

Use the `onChange` function to listen for changes to the selected date. Use
`onError` to listen for invalid entered dates.

You can control the selected date by setting the `value` prop, or use the
component in uncontrolled mode and specify an initial date by setting
`defaultValue`.

Customize the date format with the required `formatDate` and `parseDate`
callbacks.

```tsx
import { DateInput } from "@blueprintjs/datetime";

<DateInput
    formatDate={date => date.toLocaleString()}
    onChange={this.handleDateChange}
    parseDate={str => new Date(str)}
    placeholder={"M/D/YYYY"}
    value={this.state.date}
/>
```

@interface IDateInputProps

@## Localization

See the [Date picker localization docs](#datetime/datepicker.localization).
