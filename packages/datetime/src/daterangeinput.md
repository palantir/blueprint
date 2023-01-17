@# Date range input

<div class="@ns-callout @ns-intent-success @ns-icon-star">
    <h5 class="@ns-heading">Newer API available</h5>

There is an updated version of this component available in the new
[__@blueprintjs/datetime2__ package](#datetime2) called
[DateRangeInput2](#datetime2/date-range-input2). Its API is currently in development,
but you are encouraged to try it out and provide feedback for the next
version of the Blueprint date input.

</div>

The DateRangeInput component is a [ControlGroup](#core/components/control-group) composed
of two [InputGroups](#core/components/text-inputs.input-group). It shows a
[DateRangePicker](#datetime/daterangepicker) in a [Popover](#core/components/popover) on focus.

Use this component in forms where the user must enter a date range.

@reactExample DateRangeInputExample

@## Usage

DateRangeInput supports both controlled and uncontrolled usage. You can control
the selected date range by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date range by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected range and
the `onError` prop to react to invalid dates entered in the text inputs.

@## Date formatting

Customize the date format with the required `formatDate` and `parseDate`
callbacks. See [date formatting](#datetime/dateinput.date-formatting) for more
information on these props.

@## Props interface

@interface IDateRangeInputProps

@## Localization

See the [DatePicker localization docs](#datetime/datepicker.localization).
