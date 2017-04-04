@# Date range input

The `DateRangeInput` component is a [control group](#core/components/forms/control-group) composed of two
[input groups](#core/components/forms/input-group). It shows a
[`DateRangePicker`](#datetime/daterangepicker) in a [`Popover`](#core/components/popover) on focus.

Use this component in forms where the user must enter a date range.

@reactExample DateRangeInputExample

@## JavaScript API

The `DateRangeInput` component is available in the __@blueprintjs/datetime__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

Use the `onChange` function to listen for changes to the selected date. Use `onError` to listen for
invalid entered dates or date ranges.

You can control the selected date by setting the `value` prop, or use the component in uncontrolled
mode and specify an initial date by setting `defaultValue`.

```
import { DateRangeInput } from "@blueprintjs/datetime";

<DateRangeInput value={[this.state.startDate, this.state.endDate]} onChange={this.handleChange} />
```

@interface IDateRangeInputProps
