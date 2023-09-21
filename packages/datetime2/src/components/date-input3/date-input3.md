---
tag: new
---

@# DateInput3

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Migrating from [DateInput](#datetime/date-input)?

</h5>

**DateInput3** is a replacement for DateInput and will replace it in Blueprint v6.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [react-day-picker v8 migration guide](https://github.com/palantir/blueprint/wiki/react-day-picker-8-migration)
on the wiki.

</div>

**DateInput3** has the same functionality as [DateInput](#datetime/date-input) but uses
[react-day-picker v8](https://react-day-picker.js.org/) instead of [v7](https://react-day-picker-v7.netlify.app/)
to render its calendar. It renders an interactive [**InputGroup**](#core/components/input-group)
which, when focussed, displays a [**DatePicker3**](#datetime2/date-picker3) inside a
[**Popover**](#core/components/popover). It optionally renders a [**TimezoneSelect**](#datetime/timezone-select)
on the right side of the InputGroup which allows users to change the timezone of the selected date.

@reactExample DateInput3Example

@## Usage

**DateInput3** supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text input.

This component uses ISO strings to represent timestamp values in the `value` & `defaultValue` props
and the `onChange` callback.

@## Props interface

In addition to top-level **DateInput3** props, you may forward some props to `<DayPicker mode="single">` to customize
react-day-picker's behavior via `dayPickerProps` (the full list is
[documented here](https://react-day-picker.js.org/api/interfaces/DayPickerSingleProps)).

Shortcuts and modifiers are also configurable via the same API as [**DatePicker3**](#datetime2/date-picker3); see those
docs for more info.

@interface DateInput3Props

@## Date formatting

By default, **DateInput3** utilizes [date-fns](https://date-fns.org/docs/) to format & parse date strings. You may
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
import { DateInput3 } from "@blueprintjs/datetime2";
import { useCallback, useState } from "react";

function Example() {
    const [dateValue, setDateValue] = useState<string>(null);
    const handleChange = useCallback(setDateValue, []);
    const formatDate = useCallback((date: Date) => date.toLocaleString(), []);
    const parseDate = useCallback((str: string) => new Date(str), []);

    return (
        <DateInput3
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

See the [**DatePicker3** localization docs](#datetime2/date-picker3.localization).
