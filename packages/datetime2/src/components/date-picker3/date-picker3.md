---
tag: new
---

@# DatePicker3

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Migrating from [DatePicker](#datetime/datepicker)?

</h5>

**DatePicker3** is a replacement for DatePicker and will replace it in Blueprint v6.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [react-day-picker v8 migration guide](https://github.com/palantir/blueprint/wiki/react-day-picker-8-migration)
on the wiki.

</div>

**DatePicker3** has the same functionality as [DatePicker](#datetime/datepicker) but uses
[react-day-picker v8](https://react-day-picker.js.org/) instead of [v7](https://react-day-picker-v7.netlify.app/)
to render its calendar. It renders a UI to choose a single date and (optionally) a time of day. Time selection
is enabled by the [TimePicker](#datetime/timepicker) component.

@reactExample DatePicker3Example

@## Usage

**DatePicker3** supports both controlled and uncontrolled usage. You can control the selected day by setting the `value`
prop, or use the component in uncontrolled mode and specify an initial day by setting `defaultValue`. Use the `onChange`
prop to listen for changes to the selected day.

@## Props interface

In addition to top-level **DatePicker3** props, you may forward some props to `<DayPicker mode="single">` to customize
react-day-picker's behavior via `dayPickerProps` (the full list is
[documented here](https://react-day-picker.js.org/api/interfaces/DayPickerSingleProps)).

@interface DatePicker3Props

@## Shortcuts

The menu on the left of the calendars provides "shortcuts" which allow users to quickly select common dates.
The items in this menu are controlled through the `shortcuts` prop:

-   `false` (default) will hide the shortcuts menu,
-   `true` will show the built-in shortcuts, and
-   custom shortcuts can be shown by defining an array of `DatePickerShortcut` objects.

The built-in **preset shortcuts** can be seen in the example above. They are as follows:

-   Today
-   Yesterday
-   1 week ago
-   1 month ago
-   3 months ago
-   1 year ago

**Custom shortcuts** use the following interface:

@interface DatePickerShortcut

@## Modifiers

**DatePicker3** utilizes react-day-picker's built-in [modifiers](https://react-day-picker.js.org/basics/modifiers) for
various functionality (highlighting the current day, showing selected days, etc.).

You may extend and customize the default modifiers by specifying various properties in the `dayPickerProps` prop object.
In the example below, we add a custom class name to every odd-numbered day in the calendar using a simple
[Matcher](https://react-day-picker.js.org/api/types/matcher).

@reactExample DatePicker3ModifierExample

See [react-day-picker's "Custom modifiers" documentation](https://react-day-picker.js.org/basics/modifiers#custom-modifiers)
for more info.

@## Localization

**DatePicker3**, **DateInput3**, **DateRangePicker3**, and **DateRangeInput3** support calendar
localization using date-fns's [Locale](https://date-fns.org/docs/Locale) features. The `locale` prop on each
of these components accepts two types of values, either a `Locale` object or a locale code `string`.

### Using a locale code

Use the `locale: string` type to interpret the prop as a locale code (ISO 639-1 + optional country code).
The component will attempt to dynamically import the corresponding date-fns locale module.

```ts
import { DatePicker3 } from "@blueprintjs/datetime2";

function Example() {
    return <DatePicker3 locale="en-US" />;
}
```

At runtime, this will trigger a dynamic import like the following statement:

```ts
await import(/* webpackChunkName: "date-fns-en-US" */ "date-fns/locale/en-US");
```

#### Loading `date-fns` locales

By default, `date-fns` locales are loaded using an async `import("date-fns/*")` of the corresponding locale submodule.
If you need to customize this loader function, you may do so with the `dateFnsLocaleLoader` prop; this is sometimes
necessary for bundlers like Vite. For example:

```tsx
import { Locale } from "date-fns";
import React from "react";
import { DatePicker3 } from "@blueprintjs/datetime2";

const loadDateFnsLocale: (localeCode: string) => Promise<Locale> = async localeCode => {
    const localeModule = await import(`../node_modules/date-fns/esm/locale/${localeCode}/index.js`);
    return localeModule.default;
};

export const Example: React.FC = () => {
    return <DatePicker3 dateFnsLocaleLoader={loadDateFnsLocale} />;
};
```

### Using a `Locale` object

Use the `locale: Locale` type if you wish to statically load date-fns locale modules:

```ts
import { DatePicker3 } from "@blueprintjs/datetime2";
import enUS from "date-fns/locale/en-US";

function Example() {
    return <DatePicker3 locale={enUS} />;
}
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Localizing shortcuts

</h5>

Built-in preset shortcut labels are not automatically localized by setting the `locale` prop. If you need these
strings to appear in different languages, you will need to specify custom shortcuts and update their `label`
properties accordingly.

</div>

@reactExample DatePicker3LocalizedExample
