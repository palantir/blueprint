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
See the [migration guide](https://github.com/palantir/blueprint/wiki/datetime2-component-migration)
on the wiki.

</div>

The DateInput2 component is an [InputGroup](#core/components/text-inputs.input-group)
that shows a [DatePicker](#datetime/datepicker) inside a [Popover2](#popover2-package/popover2)
on focus. It optionally shows a [TimezoneSelect](#datetime2/timezone-select) on the right side of
the InputGroup, allowing the user to change the timezone of the selected date.

@reactExample DateInput2Example

@## Usage

DateInput2 supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text input.

Unlike the `DateInput` component, this component uses ISO strings to represent timestamp values.
This data type is used in the `value` prop and the `onChange` callback.

@## Date formatting

DateInput2 requires two props for parsing and formatting dates. These are essentially the plumbing
between the text input and the DatePicker.

- `formatDate(date, locale?)` receives the current `Date` and returns a string representation of it.
    The result of this function becomes the input value when it is not being edited.
- `parseDate(str, locale?)` receives text inputted by the user and converts it to a `Date` object.
    The returned `Date` becomes the next value of the component.

The optional `locale` argument to these functions is the value of the `locale` prop set on the component.

Note that we still use JS `Date` here instead of ISO strings &mdash; this makes it easy to delegate to
third party libraries like __date-fns__.

A simple implementation using built-in browser methods could look like this:

```tsx
import { DateInput2 } from "@blueprintjs/datetime2";
import { useCallback, useState } from "react";

function Example() {
    const [dateValue, setDateValue] = useState<string>(null);
    const handleChange = useCallback(setDateValue, []);
    const formatDate = useCallback((date: Date) => date.toLocaleString());
    const parseDate = useCallback((str: string) => new Date(str));

    return (
        <DateInput2
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
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse } from "date-fns";
import { useCallback, useState } from "react";

function Example() {
    const [dateValue, setDateValue] = useState<string>(null);
    const handleChange = useCallback(setDateValue, []);
    const dateFnsFormat = "yyyy-MM-dd HH:mm:ss";
    const formatDate = useCallback((date: Date) => format(date, dateFnsFormat));
    const parseDate = useCallback((str: string) => parse(date, dateFnsFormat));

    return (
        <DateInput2
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

@interface DateInput2Props

@## Localization

See the [DatePicker localization docs](#datetime/datepicker.localization).
