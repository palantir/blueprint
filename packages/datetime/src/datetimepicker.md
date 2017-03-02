@# Date time picker

A combined component consisting of a [`DatePicker`](#components.datetime.datepicker)
and a [`TimePicker`](#components.datetime.timepicker).

Use the `onChange` prop to listen for changes to the selected date and time. You can control the
selected date and time by setting the `value` prop, or use the component in uncontrolled
mode and specify an initial day by setting `defaultValue`. (If `defaultValue` is not set,
the current date and time is used as the default.)

You can pass props to the inner `DatePicker` and `TimePicker` components using
`datePickerProps` and `timePickerProps`, respectively.

@reactExample DateTimePickerExample

@## JavaScript API

The `DateTimePicker` component is available in the __@blueprintjs/datetime__ package.
Make sure to review the [general usage docs for date & time components](#components.datetime).

```tsx
import { DateTimePicker } from "@blueprintjs/datetime";

<DateTimePicker value={this.state.date} onChange={this.handleDateChange} />
```

@interface IDateTimePickerProps
