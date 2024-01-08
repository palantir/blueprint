---
tag: deprecated
---

@# Date input

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated: use [**DateInput3**](#datetime2/date-input3)

</h5>

This component is **deprecated since @blueprintjs/datetime v5.2.0** in favor of the new
**DateInput3** component available in the `@blueprintjs/datetime2` package which uses
react-day-picker v8.x instead of v7.x. You should migrate to the new API which will become the
standard in Blueprint v6.

</div>

The **DateInput** component is an [**InputGroup**](#core/components/input-group)
that shows a [**DatePicker**](#datetime/datepicker) inside a [**Popover**](#core/components/popover)
on focus. It optionally shows a [**TimezoneSelect**](#datetime/timezone-select) on the right side of
the InputGroup, allowing the user to change the timezone of the selected date.

@reactExample DateInputExample

@## Usage

**DateInput** supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text input.

This component uses ISO strings to represent timestamp values in the `value` & `defaultValue` props
and the `onChange` callback.

@## Date formatting

**DateInput** requires two props for parsing and formatting dates. These are essentially the plumbing
between the text input and the DatePicker.

-   `formatDate(date, locale?)` receives the current `Date` and returns a string representation of it.
    The result of this function becomes the input value when it is not being edited.
-   `parseDate(str, locale?)` receives text inputted by the user and converts it to a `Date` object.
    The returned `Date` becomes the next value of the component.

The optional `locale` argument to these functions is the value of the `locale` prop set on the component.

Note that we still use JS `Date` here instead of ISO strings &mdash; this makes it easy to delegate to
third party libraries like **date-fns**.

A simple implementation using built-in browser methods could look like this:

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

An implementation using **date-fns** could look like this:

```tsx
import { DateInput } from "@blueprintjs/datetime";
import { format, parse } from "date-fns";
import { useCallback, useState } from "react";

function Example() {
    const [dateValue, setDateValue] = useState<string>(null);
    const handleChange = useCallback(setDateValue, []);
    const dateFnsFormat = "yyyy-MM-dd HH:mm:ss";
    const formatDate = useCallback((date: Date) => format(date, dateFnsFormat), []);
    const parseDate = useCallback((str: string) => parse(date, dateFnsFormat), []);

    return (
        <DateInput
            formatDate={formatDate}
            onChange={handleChange}
            parseDate={parseDate}
            placeholder={dateFnsFormat}
            value={dateValue}
        />
    );
}
```

@## Props interface

@interface DateInputProps

@## Localization

See the [DatePicker localization docs](#datetime/datepicker.localization).
