---
tag: new
---

@# DateInput3

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Migrating from [DateInput](#datetime/date-input)?

</h5>

__DateInput3__ is a replacement for DateInput and will replace it in Blueprint v6.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [react-day-picker v8 migration guide](https://github.com/palantir/blueprint/wiki/react-day-picker-8-migration)
on the wiki.

</div>

__DateInput3__ has the same functionality as [DateInput](#datetime/date-input) but uses
[react-day-picker v8](https://react-day-picker.js.org/) instead of [v7](https://react-day-picker-v7.netlify.app/)
to render its calendar. It renders an interactive [__InputGroup__](#core/components/input-group)
which, when focussed, displays a [__DatePicker3__](#datetime2/date-picker3) inside a
[__Popover__](#core/components/popover). It optionally renders a [__TimezoneSelect__](#datetime/timezone-select)
on the right side of the InputGroup which allows users to change the timezone of the selected date.

@reactExample DateInput3Example

@## Usage

__DateInput3__ supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text input.

This component uses ISO strings to represent timestamp values in the `value` & `defaultValue` props
and the `onChange` callback.

@## Date formatting

__DateInput3__ requires two props for parsing and formatting dates. These are essentially the plumbing
between the text input and __DatePicker3__.

-   `formatDate(date: Date, localeCode?: string)` receives the current `Date` and returns a string representation of it.
    The result of this function becomes the input value when it is not being edited.
-   `parseDate(str: string, localeCode?: string)` receives text inputted by the user and converts it to a `Date` object.
    The returned `Date` becomes the next value of the component.

The optional `locale` argument to these functions is the value of the `locale` prop set on the component.

Note that we still use JS `Date` here instead of ISO strings &mdash; this makes it easy to delegate to
third party libraries like __date-fns__.

A simple implementation using built-in browser methods could look like this:

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

An implementation using __date-fns__ could look like this:

```tsx
import { DateInput3 } from "@blueprintjs/datetime2";
import { format, parse } from "date-fns";
import { useCallback, useState } from "react";

function Example() {
    const [dateValue, setDateValue] = useState<string>(null);
    const handleChange = useCallback(setDateValue, []);
    const dateFnsFormat = "yyyy-MM-dd HH:mm:ss";
    const formatDate = useCallback((date: Date) => format(date, dateFnsFormat), []);
    const parseDate = useCallback((str: string) => parse(date, dateFnsFormat), []);

    return (
        <DateInput3
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

@interface DateInput3Props

@## Localization

See the [__DatePicker3__ localization docs](#datetime2/date-picker3.localization).
