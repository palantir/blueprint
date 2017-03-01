@# Time picker

A `TimePicker` allows the user to specify a time.

`TimePicker`s behave similarly to standard [React form inputs](https://facebook.github.io/react/docs/forms.html).

Use the `onChange` prop to listen for changes to the set time. You can control the selected time by
setting the `value` prop, or use the component in uncontrolled mode and specify an initial time by
setting `defaultValue`.

`TimePicker` has no direct localization support. You should handle localization directly in your
application if needed.

`TimePicker` uses `Date` objects across its API but ignores their year, month, and day fields.

@reactExample TimePickerExample

@## JavaScript API

The `TimePicker` component is available in the __@blueprintjs/datetime__ package.
Make sure to review the [general usage docs for date & time components](#components.datetime).

@interface ITimePickerProps
