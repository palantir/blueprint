@# Date range picker

A `DateRangePicker` shows two sequential month calendars and lets the user select a single range of
days.

@reactExample DateRangePickerExample

@## Date ranges

`DateRangePicker` uses the `DateRange` type across its API. This is an alias for
the tuple type `[Date, Date]`.

Semantically:
* `[null, null]` represents an empty selection.
* `[someDate, null]` represents a date range where a single endpoint is known.
* `[someDate, someOtherDate]` represents a full date range where both endpoints are known.

@## Shortcuts

The menu on the left of the calendars provides "shortcuts" that allow users to
quickly select common date ranges. The items in this menu are controlled through
the `shortcuts` prop: `true` to show presets (default), `false` to hide, or an
array of `IDateRangeShortcut` objects to define custom shortcuts.

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

@## Props

Use the `onChange` prop to listen for changes to the set date range. You can
control the selected date range by setting the `value` prop, or use the
component in uncontrolled mode and specify an initial date range by setting
`defaultValue`.

```tsx
import { DateRangePicker } from "@blueprintjs/datetime";

<DateRangePicker
    value={[this.state.startDate, this.state.endDate]}
    onChange={this.handleDateChange}
/>
```

@interface IDateRangePickerProps
