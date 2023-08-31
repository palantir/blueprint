---
tag: new
---

@# DatePicker2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h5 class="@ns-heading">

Migrating from [DatePicker](#datetime/datepicker)?

</h5>

DatePicker2 is a replacement for DatePicker and will replace it in Blueprint v6.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [react-day-picker v8 migration guide](https://github.com/palantir/blueprint/wiki/react-day-picker-8-migration)
on the wiki.

</div>

__DatePicker2__ has the same functionality as [DatePicker](#datetime/datepicker) but uses
[react-day-picker v8](https://react-day-picker.js.org/) instead of [v7](https://react-day-picker-v7.netlify.app/)
to render its calendar.

@reactExample DatePicker2Example

@## Usage

__DatePicker2__ supports both controlled and uncontrolled usage. You can control the selected day by setting the `value`
prop, or use the component in uncontrolled mode and specify an initial day by setting `defaultValue`. Use the `onChange`
prop to listen for changes to the selected day.

@## Props interface

Some props are managed by __DatePicker2__, while others are passed to the __react-day-picker__ library.
The full list of props you can forward to `<DayPicker mode="single">` is
[documented here](https://react-day-picker.js.org/api/interfaces/DayPickerSingleProps).These

@interface DatePicker2Props

@## Shortcuts

The menu on the left of the calendars provides "shortcuts" which allow users to
quickly select common dates. The items in this menu are controlled through
the `shortcuts` prop:

-   `false` (default) will hide the shortcuts menu,
-   `true` will show the built-in shortcuts, and
-   custom shortcuts can be shown by defining an array of `DatePickerShortcut` objects.

The **preset shortcuts** can be seen in the example above. They are as follows:

-   Today
-   Yesterday
-   1 week ago
-   1 month ago
-   3 months ago
-   1 year ago

**Custom shortcuts** use the following interface:

@interface DatePickerShortcut

@## Modifiers

__DatePicker2__ utilizes react-day-picker's built-in [modifiers](https://react-day-picker.js.org/basics/modifiers) for
various functionality (highlighting the current day, showing selected days, etc.).

You may use the `modifiers` prop to conditionally apply custom styles to calendar days using matchers.
[See "Custom modifiers" documentation here](https://react-day-picker.js.org/basics/modifiers#custom-modifiers).

@## Localization

__DatePicker2__ supports calendar localization using date-fns [Locale](https://date-fns.org/docs/Locale).
Use the `localeCode` prop to specify a locale code (ISO 639-1 + optional country code) and the component will
load the corresponding date-fns locale. For example, `localeCode="fr"` is used below.

@reactExample DatePicker2LocalizedExample
