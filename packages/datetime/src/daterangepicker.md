@# Date range picker

A DateRangePicker shows two sequential month calendars and allows the user to select
a _range_ of days.

@reactExample DateRangePickerExample

@## Usage

DateRangePicker supports both controlled and uncontrolled usage. You can control
the selected date range by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial date range by setting `defaultValue`. Use the
`onChange` prop to listen for changes to the selected range.

@## Date ranges

DateRangePicker uses the `DateRange` type across its API. This is an alias for
the tuple type `[Date, Date]`.

Semantically:
* `[null, null]` represents an empty selection.
* `[someDate, null]` represents a date range where a single endpoint is known.
* `[someDate, someOtherDate]` represents a full date range where both endpoints are known.

@## Shortcuts

The menu on the left of the calendars provides "shortcuts" which allow users to
quickly select common date ranges. The items in this menu are controlled through
the `shortcuts` prop:

- `true` (default) will show the built-in shortcuts,
- `false` will hide the shortcuts menu, and
- custom shortcuts can be shown by defining an array of `DateRangeShortcut` objects.

The **preset shortcuts** can be seen in the example above. They are as follows:

- Today (only appears if `allowSingleDayRange={true}`)
- Yesterday (only appears if `allowSingleDayRange={true}`)
- Past week
- Past month
- Past 3 months
- Past 6 months
- Past year
- Past 2 years

**Custom shortcuts** use the following interface:

@interface IDateRangeShortcut

@## Props interface

@interface IDateRangePickerProps

@## Localization

See the [Date picker localization docs](#datetime/datepicker.localization).
