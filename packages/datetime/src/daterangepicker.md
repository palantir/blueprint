@# Date range picker

A `DateRangePicker` shows two sequential month calendars and lets the user select a single range of
days.

Use the `onChange` prop to listen for changes to the set date range. You can control the selected
date range by setting the `value` prop, or use the component in uncontrolled mode and specify an
initial date range by setting `defaultValue`.

`DateRangePicker` uses the `DateRange` type across its API.
This is an alias for the tuple type `[Date, Date]`.
Semantically:
* `[null, null]` represents an empty selection
* `[someDate, null]` represents a date range where a single day endpoint is known.
* `[someDate, someOtherDate]` represents a full date range where both endpoints known.

@reactExample DateRangePickerExample

@## JavaScript API

The `DateRangePicker` component is available in the __@blueprintjs/datetime__ package.
Make sure to review the [general usage docs for date & time components](#components.datetime).

```tsx
import { DateRangePicker } from "@blueprintjs/datetime";

<DateRangePicker
    value={[this.state.startDate, this.state.endDate]}
    onChange={this.handleDateChange}
/>
```

@interface IDateRangePickerProps
