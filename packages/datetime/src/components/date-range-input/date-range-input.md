@# DateRangeInput

The DateRangeInput component is an [ControlGroup](#core/components/control-group) composed
of two [InputGroups](#core/components/text-inputs.input-group). It shows a
[DateRangePicker](#datetime/daterangepicker) in a [Popover](#core/components/popover)
on focus.

Unlike [DateInput](#datetime/date-input), this component does _not_ yet have support for
a built-in [TimezoneSelect](#datetime/timezone-select).

<!-- It optionally shows a [TimezoneSelect](#datetime/timezone-select) as the third
element in the ControlGroup, allowing the user to change the timezone of the selected date range. -->

@reactExample DateRangeInputExample

@## Usage

DateRangeInput supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text inputs.

Unlike the `DateRangeInput` component, this component uses ISO strings to represent timestamp values.
This data type is used in the `value` prop and the `onChange` callback.

@## Date formatting

Customize the date format with the required `formatDate` and `parseDate` props.
See [DateInput's date formatting docs](#datetime/date-input.date-formatting) for more details.

@## Props interface

@interface DateRangeInputProps

@## Localization

See the [DatePicker localization docs](#datetime/datepicker.localization).
