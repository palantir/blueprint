@# DatePicker

**DatePicker** renders a UI to choose a single date and (optionally) a time of day.
It is built on top of the [react-day-picker v8](https://daypicker.dev/v8) library.
Time selection is enabled by the [TimePicker](#datetime/timepicker) component.

@## Import

```tsx
import { DatePicker } from "@blueprintjs/datetime";
```

@reactExample DatePickerExample

@## Usage

**DatePicker** supports both controlled and uncontrolled usage. You can control the selected day by setting the `value`
prop, or use the component in uncontrolled mode and specify an initial day by setting `defaultValue`. Use the `onChange`
prop to listen for changes to the selected day.

@## Props interface

Some props are managed by **DatePicker**, while others are passed to the **react-day-picker** library. These
passed-through props are documented in full in the
[**react-day-picker** documentation](https://daypicker.dev/v8).

In addition to top-level **DatePicker** props, you may forward some props to `<DayPicker mode="single">` to customize
react-day-picker's behavior via `dayPickerProps` (the full list is
[documented here](https://daypicker.dev/v8/api/interfaces/DayPickerSingleProps)).

@interface DatePickerProps

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

**DatePicker** utilizes react-day-picker's built-in [modifiers](https://daypicker.dev/guides/custom-modifiers#built-in-modifiers) for
various functionality (highlighting the current day, showing selected days, etc.).

You may extend and customize the default modifiers by specifying various properties in the `dayPickerProps` prop object.
In the example below, we add a custom class name to every odd-numbered day in the calendar using a simple
[Matcher](https://daypicker.dev/api/type-aliases/Matcher).

@reactExample DatePickerModifierExample

See [react-day-picker's "Custom modifiers" documentation](https://daypicker.dev/guides/custom-modifiers)
for more info.

@## Localization

**DatePicker**, **DateInput**, **DateRangePicker**, and **DateRangeInput** support calendar
localization using date-fns's [Locale](https://date-fns.org/v2.28.0/docs/Locale) features. The `locale` prop on each
of these components accepts two types of values, either a `Locale` object or a locale code `string`.

### Using a locale code

Use the `locale: string` type to interpret the prop as a locale code (ISO 639-1 + optional country code).
The component will attempt to dynamically import the corresponding date-fns locale module.

```ts
import { DatePicker } from "@blueprintjs/datetime";

function Example() {
    return <DatePicker locale="en-US" />;
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
import { DatePicker } from "@blueprintjs/datetime";

const loadDateFnsLocale: (localeCode: string) => Promise<Locale> = async localeCode => {
    const localeModule = await import(`../node_modules/date-fns/esm/locale/${localeCode}/index.js`);
    return localeModule.default;
};

export const Example: React.FC = () => {
    return <DatePicker dateFnsLocaleLoader={loadDateFnsLocale} />;
};
```

### Using a `Locale` object

Use the `locale: Locale` type if you wish to statically load date-fns locale modules:

```ts
import { DatePicker } from "@blueprintjs/datetime";
import enUS from "date-fns/locale/en-US";

function Example() {
    return <DatePicker locale={enUS} />;
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

@reactExample DatePickerLocalizedExample
