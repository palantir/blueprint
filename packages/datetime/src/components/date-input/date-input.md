@# DateInput

The **DateInput** component renders an interactive [**InputGroup**](#core/components/input-group)
which, when focussed, displays a [**DatePicker**](#datetime/date-picker) inside a
[**Popover**](#core/components/popover). It optionally renders a [**TimezoneSelect**](#datetime/timezone-select)
on the right side of the InputGroup which allows users to change the timezone of the selected date.

@## Import

```tsx
import { DateInput } from "@blueprintjs/datetime";
```

@reactExample DateInputExample

@## Usage

**DateInput** supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text input.

This component uses ISO strings to represent timestamp values in the `value` & `defaultValue` props
and the `onChange` callback.

@## Props interface

In addition to top-level **DateInput** props, you may forward some props to `<DayPicker mode="single">` to customize
react-day-picker's behavior via `dayPickerProps` (the full list is
[documented here](https://daypicker.dev/v8/api/interfaces/DayPickerSingleProps)).

Shortcuts and modifiers are also configurable via the same API as [**DatePicker**](#datetime/date-picker); see those
docs for more info.

@interface DateInputProps

@## Date formatting

By default, **DateInput** utilizes [date-fns](https://date-fns.org/docs/) to format & parse date strings. You may
specify which [date-fns format](https://date-fns.org/docs/format) to use with the `dateFnsFormat` prop.

If you do not specify this prop, the component will use one of its default formats corresponding to the time precision
specified by the `timePrecision` and `timePickerProps` props.

Finally, you have the option to specify a custom formatter & parser with the `formatDate` and `parseDate` props:

-   `formatDate(date: Date, localeCode?: string)` receives the current `Date` and returns a string representation of it.
    The result of this function becomes the input value when it is not being edited.
-   `parseDate(str: string, localeCode?: string)` receives text inputted by the user and converts it to a `Date` object.
    The returned `Date` becomes the next value of the component.

The optional `localeCode` argument to these functions is the value of the `locale` prop set on the component.

A simple implementation of a custom formatter & parser using built-in browser methods could look like this:

```tsx
import { DateInput } from "@blueprintjs/datetime";
import { useCallback, useState } from "react";

function Example() {
    const [dateValue, setDateValue] = useState<string>(null);
    const handleChange = useCallback(setDateValue, []);
    const formatDate = useCallback((date: Date) => date.toLocaleString(), []);
    const parseDate = useCallback((str: string) => new Date(str), []);

    return (
        <DateInput
            formatDate={formatDate}
            onChange={handleChange}
            parseDate={parseDate}
            placeholder="M/D/YYYY"
            value={dateValue}
        />
    );
}
```

@## Localization

See the [**DatePicker** localization docs](#datetime/date-picker.localization).
