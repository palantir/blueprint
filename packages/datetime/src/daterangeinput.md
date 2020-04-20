@# Date range input

The `DateRangeInput` component is a [control group](#core/components/control-group) composed of two
[input groups](#core/components/text-inputs.input-group). It shows a
[`DateRangePicker`](#datetime/daterangepicker) in a [`Popover`](#core/components/popover) on focus.

Use this component in forms where the user must enter a date range.

@reactExample DateRangeInputExample

@## Props

Use the `onChange` function to listen for changes to the selected date. Use
`onError` to listen for invalid entered dates or date ranges.

You can control the selected date by setting the `value` prop, or use the
component in uncontrolled mode and specify an initial date by setting
`defaultValue`.

Customize the date format with the required `formatDate` and `parseDate`
callbacks. See [date formatting](#datetime/dateinput.date-formatting) for more
information on these props.

```tsx
import { DateRangeInput } from "@blueprintjs/datetime";

<DateRangeInput
    formatDate={date => date.toLocaleString()}
    onChange={this.handleRangeChange}
    parseDate={str => new Date(str)}
    value={[this.state.startDate, this.state.endDate]}
/>
```

@interface IDateRangeInputProps

@## Localization

See the [Date picker localization docs](#datetime/datepicker.localization).
