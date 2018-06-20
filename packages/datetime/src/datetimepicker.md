@# Date time picker

`DateTimePicker` composes a [`DatePicker`](#datetime/datepicker)
and a [`TimePicker`](#datetime/timepicker) into one container.

@reactExample DateTimePickerExample

@## Props

Use the `onChange` prop to listen for changes to the selected date and time. You
can control the selected date and time by setting the `value` prop, or use the
component in uncontrolled mode and specify an initial day by setting
`defaultValue`. (If `defaultValue` is not set, the current date and time is used
as the default.)

You can pass props to the inner `DatePicker` and `TimePicker` components using
`datePickerProps` and `timePickerProps`, respectively.

```tsx
import { DateTimePicker } from "@blueprintjs/datetime";

<DateTimePicker value={this.state.date} onChange={this.handleDateChange} />
```

@interface IDateTimePickerProps
