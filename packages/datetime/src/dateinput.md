@# Date input

<div class="@ns-callout @ns-intent-success @ns-icon-star">
    <h4 class="@ns-heading">Newer API available</h4>

There is an updated version of this component available in the new
[__@blueprintjs/datetime2__ package](#datetime2) called
[DateInput2](#datetime2/date-input2). Its API is currently in development,
but you are encouraged to try it out and provide feedback for the next
version of the Blueprint date input.

</div>

The DateInput component is an [InputGroup](#core/components/text-inputs.input-group)
that shows a [DatePicker](#datetime/datepicker) in a [Popover](#core/components/popover)
on focus. Use it in forms where the user must enter a date.

@reactExample DateInputExample

@## Usage

DateInput supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text input.

@## Date formatting

DateInput and its more complex cousin [DateRangeInput](#datetime/daterangeinput)
require two props for formatting and parsing dates. These are essentially the plumbing
between the text input and the DatePicker.

- `formatDate(date, locale?)` receives the current `Date` and returns a string representation of it.
    The result of this function becomes the input value when it is not being edited.
- `parseDate(str, locale?)` receives text inputted by the user and converts it to a `Date` object.
    The returned `Date` becomes the next value of the component.

The optional `locale` argument to these functions is the value of the `locale` prop set on the component.

A simple implementation using built-in browser methods could look like this:

```tsx
<DateInput
    formatDate={date => date.toLocaleString()}
    onChange={this.handleDateChange}
    parseDate={str => new Date(str)}
    placeholder="M/D/YYYY"
    value={this.state.date}
/>
```

An implementation using __moment.js__ could look like this:

```tsx
import { DateInput, DateFormatProps } from "@blueprintjs/datetime";
import moment from "moment";

function getMomentFormatter(format: string): DateFormatProps {
    // note that locale argument comes from locale prop and may be undefined
    return {
        formatDate: (date, locale) => moment(date).locale(locale).format(format),
        parseDate: (str, locale) => moment(str, format).locale(locale).toDate(),
        placeholder: format,
    }
};

<DateInput {...getMomentFormatter("LL")} locale="de" />
```

@## Props interface

@interface IDateInputProps

@## Localization

See the [Date picker localization docs](#datetime/datepicker.localization).
