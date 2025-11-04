@# DateRangeInput

The **DateRangeInput** component renders a [**ControlGroup**](#core/components/control-group) composed
of two [**InputGroups**](#core/components/input-group) and shows a [**DateRangePicker**](#datetime/date-range-picker)
inside a [**Popover**](#core/components/popover) upon focus.

Unlike [**DateInput**](#datetime/date-input), this component does _not_ yet have support for
a built-in [**TimezoneSelect**](#datetime/timezone-select).

<!-- It optionally shows a [TimezoneSelect](#datetime/timezone-select) as the third
element in the ControlGroup, allowing the user to change the timezone of the selected date range. -->

@## Import

```tsx
import { DateRangeInput } from "@blueprintjs/datetime";
```

@reactExample DateRangeInputExample

@## Usage

**DateRangeInput** supports both controlled and uncontrolled usage. You can control the selected date by setting the
`value` prop, or use the component in uncontrolled mode and specify an initial date by setting `defaultValue`.
Use the `onChange` prop callback to listen for changes to the selected day and the `onError` prop to react to invalid
dates entered in the text inputs.

@## Date formatting

You may customize the date display format with the required `formatDate` and `parseDate` props.
See [DateInput's date formatting docs](#datetime3/date-input.date-formatting) for more details.

@## Props interface

@interface DateRangeInputProps

@## Localization

See the [**DatePicker** localization docs](#datetime/date-picker.localization).
