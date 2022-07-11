---
tag: new
---

@# DateRangeInput2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [DateRangeInput](#datetime/daterangeinput)?

</h4>

DateRangeInput2 is a replacement for the [DateRangeInput component](#datetime/daterangeinput) from
[__@blueprintjs/datetime__ package](#datetime) and will replace it in Blueprint v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [migration guide](https://github.com/palantir/blueprint/wiki/datetime2-component-migration)
on the wiki.

</div>

The DateRangeInput2 component is an [ControlGroup](#core/components/control-group) composed
of two [InputGroups](#core/components/text-inputs.input-group). It shows a
[DateRangePicker](#datetime/daterangepicker) in a [Popover2](#popover2-package/popover2)
on focus.

Unlike [DateInput2](#datetime2/date-input2), this component does _not_ yet have support for
a built-in [TimezoneSelect](#datetime2/timezone-select). This functionality will be coming soon.

<!-- It optionally shows a [TimezoneSelect](#datetime2/timezone-select) as the third
element in the ControlGroup, allowing the user to change the timezone of the selected date range. -->

@reactExample DateRangeInput2Example

@## Usage

DateRangeInput2 supports both controlled and uncontrolled usage. You can control
the selected date by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and
the `onError` prop to react to invalid dates entered in the text inputs.

Unlike the `DateRangeInput` component, this component uses ISO strings to represent timestamp values.
This data type is used in the `value` prop and the `onChange` callback.

@## Date formatting

Customize the date format with the required `formatDate` and `parseDate` props.
See [DateInput2's date formatting docs](#datetime2/date-input2.date-formatting) for more details.

@## Props interface

@interface DateRangeInput2Props

@## Localization

See the [DatePicker localization docs](#datetime/datepicker.localization).
