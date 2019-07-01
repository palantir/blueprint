@# Time picker

A `TimePicker` allows the user to specify a time.

`TimePicker` has no direct localization support. You should handle localization in your
application if needed.

@reactExample TimePickerExample

@## Props

Use the `onChange` prop to listen for changes to the set time. You can control the selected time by
setting the `value` prop, or use the component in uncontrolled mode and specify an initial time by
setting `defaultValue`.

`TimePicker` uses `Date` objects across its API but ignores their year, month, and day fields.

@interface ITimePickerProps
