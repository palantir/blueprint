@# Time picker

__TimePicker__ renders a UI to select a time.

This component has no direct localization support. You should handle localization in your application if needed.

@reactExample TimePickerExample

@## Props interface

Use the `onChange` prop to listen for changes to the set time. You can control the selected time by setting the
`value` prop, or use the component in uncontrolled mode and specify an initial time by setting `defaultValue`.

__TimePicker__ uses `Date` objects across its API but ignores their year, month, and day fields.

@interface TimePickerProps
