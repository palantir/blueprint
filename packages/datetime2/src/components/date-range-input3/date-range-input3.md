---
tag: new
---

@# DateRangeInput3

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Migrating from [DateRangeInput](#datetime/date-range-input)?

</h5>

**DateRangeInput3** is a replacement for DateRangeInput and will replace it in Blueprint v6.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [react-day-picker v8 migration guide](https://github.com/palantir/blueprint/wiki/react-day-picker-8-migration)
on the wiki.

</div>

**DateRangeInput3** has the same functionality as [DateRangeInput](#datetime/date-range-input) but uses
[react-day-picker v8](https://react-day-picker.js.org/) instead of [v7](https://react-day-picker-v7.netlify.app/)
to render its calendar(s). It renders a [**ControlGroup**](#core/components/control-group) composed
of two [**InputGroups**](#core/components/input-group) and shows a [**DateRangePicker3**](#datetime2/date-range-picker3)
inside a [**Popover**](#core/components/popover) upon focus.

Unlike [**DateInput3**](#datetime2/date-input3), this component does _not_ yet have support for
a built-in [**TimezoneSelect**](#datetime/timezone-select).

<!-- It optionally shows a [TimezoneSelect](#datetime/timezone-select) as the third
element in the ControlGroup, allowing the user to change the timezone of the selected date range. -->

@reactExample DateRangeInput3Example

@## Usage

**DateRangeInput3** supports both controlled and uncontrolled usage. You can control the selected date by setting the
`value` prop, or use the component in uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and the `onError` prop to react to invalid
dates entered in the text inputs.

@## Date formatting

You may customize the date display format with the required `formatDate` and `parseDate` props.
See [DateInput3's date formatting docs](#datetime3/date-input3.date-formatting) for more details.

@## Props interface

@interface DateRangeInput3Props

@## Localization

See the [**DatePicker3** localization docs](#datetime2/date-picker3.localization).
