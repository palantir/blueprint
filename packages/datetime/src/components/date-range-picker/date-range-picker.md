---
tag: new
---

@# DateRangePicker3

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Migrating from [DateRangePicker](#datetime/daterangepicker)?

</h5>

**DateRangePicker3** is a replacement for DateRangePicker and will replace it in Blueprint v6.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [react-day-picker v8 migration guide](https://github.com/palantir/blueprint/wiki/react-day-picker-8-migration)
on the wiki.

</div>

**DateRangePicker3** shows two sequential month calendars and allows the user to select a _range_ of days.

@reactExample DateRangePicker3Example

@## Usage

**DateRangePicker3** supports both controlled and uncontrolled usage. You can control the selected date range by setting
the `value` prop, or use the component in uncontrolled mode and specify an initial date range by setting `defaultValue`.
Use the `onChange` prop to listen for changes to the selected range.

@## Date ranges

**DateRangePicker3** uses the `DateRange` type across its API. This is an alias for the tuple type `[Date, Date]`.

Semantically:

-   `[null, null]` represents an empty selection.
-   `[someDate, null]` represents a date range where a single endpoint is known.
-   `[someDate, someOtherDate]` represents a full date range where both endpoints are known.

@## Shortcuts

The menu on the left of the calendars provides "shortcuts" which allow users to quickly select common date ranges. The
items in this menu are controlled through the `shortcuts` prop:

-   `true` (default) will show the built-in shortcuts,
-   `false` will hide the shortcuts menu, and
-   custom shortcuts can be shown by defining an array of `DateRangeShortcut` objects.

The **preset shortcuts** can be seen in the example above. They are as follows:

-   Today (only appears if `allowSingleDayRange={true}`)
-   Yesterday (only appears if `allowSingleDayRange={true}`)
-   Past week
-   Past month
-   Past 3 months
-   Past 6 months
-   Past year
-   Past 2 years

**Custom shortcuts** use the following interface:

@interface DateRangeShortcut

@## Props interface

@interface DateRangePicker3Props

@## Localization

See the [**DatePicker3** localization docs](#datetime2/date-picker3.localization).
