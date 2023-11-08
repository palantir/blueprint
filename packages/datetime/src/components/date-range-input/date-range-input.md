---
tag: deprecated
---

@# Date range input

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated: use [**DateRangeInput3**](#datetime2/date-range-input3)

</h5>

This component is **deprecated since @blueprintjs/datetime v5.2.0** in favor of the new
**DateRangeInput3** component available in the `@blueprintjs/datetime2` package which uses
react-day-picker v8.x instead of v7.x. You should migrate to the new API which will become the
standard in Blueprint v6.

</div>

The **DateRangeInput** component is [**ControlGroup**](#core/components/control-group) composed
of two [**InputGroups**](#core/components/input-group). It shows a
[**DateRangePicker**](#datetime/daterangepicker) in a [**Popover**](#core/components/popover)
on focus.

Unlike [**DateInput**](#datetime/date-input), this component does _not_ yet have support for
a built-in [**TimezoneSelect**](#datetime/timezone-select).

@reactExample DateRangeInputExample

@## Usage

**DateRangeInput** supports both controlled and uncontrolled usage. You can control
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
