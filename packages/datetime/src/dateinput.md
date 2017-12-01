@# Date input

The `DateInput` component is an [input group](#core/components/forms/input-group) that shows a [`DatePicker`](#datetime/datepicker) in a [`Popover`](#core/components/popover) on focus.

Use the `onChange` function to listen for changes to the selected date. Use `onError` to listen for
invalid entered dates.

You can control the selected date by setting the `value` prop, or use the component in uncontrolled
mode and specify an initial date by setting `defaultValue`.

Use this component in forms where the user must enter a date.

@reactExample DateInputExample

@## JavaScript API

The `DateInput` component is available in the __@blueprintjs/datetime__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

```tsx
import { DateInput } from "@blueprintjs/datetime";

<DateInput value={this.state.date} onChange={this.handleDateChange} />
```

@interface IDateInputProps

@interface IDateFormatter
