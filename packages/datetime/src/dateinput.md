@# Date input

The `DateInput` component is an [input group](#core/components/forms/input-group) that shows a [`DatePicker`](#datetime/datepicker) in a [`Popover`](#core/components/popover) on focus.

Use the `onChange` function to listen for changes to the selected date. Use `onError` to listen for
invalid entered dates.

You can control the selected date by setting the `value` prop, or use the component in uncontrolled
mode and specify an initial date by setting `defaultValue`.

Use this component in forms where the user must enter a date.

@reactExample DateInputExample

@## Date formatting

`DateInput` and its more complex cousin `DateRangeInput` require two props for formatting and parsing dates:

- `formatDate(date, locale?)` receives the current `Date` and returns a string representation of it. The result of this function becomes the input value when it is not being edited.
- `parseDate(str, locale?)` receives text inputted by the user and converts it to a `Date` object. The returned `Date` becomes the next value of the component.

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
import * as moment from "moment";

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


@## JavaScript API

The `DateInput` component is available in the __@blueprintjs/datetime__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

```tsx
import { DateInput } from "@blueprintjs/datetime";

<DateInput value={this.state.date} onChange={this.handleDateChange} />
```

@interface IDateInputProps

@interface IDateFormatter
