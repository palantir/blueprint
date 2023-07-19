@# Date range input

The __DateRangeInput__ component is [__ControlGroup__](#core/components/control-group) composed
of two [__InputGroups__](#core/components/text-inputs.input-group). It shows a
[__DateRangePicker__](#datetime/daterangepicker) in a [__Popover__](#core/components/popover)
on focus.

Unlike [__DateInput__](#datetime/date-input), this component does _not_ yet have support for
a built-in [__TimezoneSelect__](#datetime/timezone-select).

<!-- It optionally shows a [TimezoneSelect](#datetime/timezone-select) as the third
element in the ControlGroup, allowing the user to change the timezone of the selected date range. -->

@reactExample DateRangeInputExample

@## Usage

__DateRangeInput__ supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text inputs.

@## Date formatting

Customize the date format with the required `formatDate` and `parseDate` props.
See [DateInput's date formatting docs](#datetime/date-input.date-formatting) for more details.

@## Props interface

@interface DateRangeInputProps

@## Localization

See the [DatePicker localization docs](#datetime/datepicker.localization).
