@# Date picker

__DatePicker__ renders a UI to choose a single date and (optionally) a time of day. It is built on top of the
[__react-day-picker__ library](https://github.com/gpbl/react-day-picker). Time selection is enabled by the
[__TimePicker__](#datetime/timepicker) component.

@reactExample DatePickerExample

@## Usage

__DatePicker__ supports both controlled and uncontrolled usage. You can control the selected day by setting the `value`
prop, or use the component in uncontrolled mode and specify an initial day by setting `defaultValue`. Use the `onChange`
prop to listen for changes to the selected day.

@## Props interface

Some props are managed by __DatePicker__, while others are passed to the __react-day-picker__ library. These
passed-through props are documented in full in the
[__react-day-picker__ documentation](https://react-day-picker-v7.netlify.app/).

@interface DatePickerProps

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

You can use the `modifiers` prop to conditionally apply styles to days. Modifiers are a react-day-picker concept and are
documented in full in the
[__react-day-picker__ documentation](https://react-day-picker-v7.netlify.app/docs/matching-days).

The example below renders a DatePicker that prevents the user from selecting any Sundays, by using the component in
controlled mode and with the `modifiers` prop:

```scss
// in CSS
.#{$ns}-datepicker .DayPicker-Day--isSunday {
    // CSS rules to make the day appear disabled
}
```

```tsx
// in TypeScript
import { DatePicker } from "@blueprintjs/datetime";

export class DatePickerExample extends React.Component<{}, { selectedDate: Date }> {
    public state = { selectedDate: new Date() };

    public render() {
        // name of modifier function becomes the suffix for the CSS class above
        const modifiers = { isSunday };
        return (
            <DatePicker
                modifiers={modifiers}
                onChange={newDate => this.handleChange(newDate)}
                value={this.state.selectedDate}
            />
        );
    }

    private handleChange(date: Date) {
        if (!isSunday(date)) {
            this.setState({ selectedDate: date });
        }
    }
}

function isSunday(date: Date) {
    return date.getDay() === 0;
}
```

@## Localization

__DatePicker__, __DateRangePicker__, __DateInput__, and __DateRangeInput__ all support calendar localization
using an interface defined by __react-day-picker__:

```js
import { LocaleUtils } from "react-day-picker";
```

By supplying a `locale: string` and `localeUtils: LocaleUtils` prop to these Blueprint components, you can customize how
dates are rendered, which day of the week is the first column, etc.

You will need to define the functions of `LocaleUtil` on your own.
[See the interface definition](https://github.com/gpbl/react-day-picker/blob/v7.3.0/types/utils.d.ts#L5)
for more details.

Since __@blueprintjs/datetime__ depends on [__date-fns__](https://date-fns.org/), you may wish to leverage this library
which is already in your bundle to implement localization, for example:

```tsx
import { DatePicker, DatePickerLocaleUtils } from "@blueprintjs/datetime";
import { format, Locale, parse } from "date-fns";

const DATE_FNS_LOCALE_UTILS: DatePickerLocaleUtils = {
    // implement locale utils using "date-fns" functions
};

<DatePicker locale="fr" localeUtils={DATE_FNS_LOCALE_UTILS} />;
```

More detailed examples can be found in the
[__react-day-picker__ documentation](https://react-day-picker-v7.netlify.app/docs/localization).
