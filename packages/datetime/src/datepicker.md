@# Date picker

A `DatePicker` shows a monthly calendar and allows the user to choose a single date.

`DatePicker` is built on top of the [**react-day-picker**](https://github.com/gpbl/react-day-picker) library.

@reactExample DatePickerExample

@## Shortcuts

The menu on the left of the calendars provides "shortcuts" that allow users to
quickly select common dates. The items in this menu are controlled through
the `shortcuts` prop: `true` to show presets, `false` to hide (default), or an
array of `IDatePickerShortcut` objects to define custom shortcuts.

The **preset shortcuts** can be seen in the example above. They are as follows:

- Today
- Yesterday
- 1 week ago
- 1 month ago
- 3 months ago
- 1 year ago

**Custom shortcuts** use the following interface:

@interface IDatePickerShortcut

@## Props

Use the `onChange` prop to listen for changes to the set date range. You can
control the selected date range by setting the `value` prop, or use the
component in uncontrolled mode and specify an initial date range by setting
`defaultValue`.

@## Modifiers

You can use the `modifiers` prop to conditionally apply styles to days.
Modifiers are a react-day-picker concept and are documented in full in the
[**react-day-picker** documentation](http://react-day-picker.js.org/docs/matching-days).

The example below creates a `DatePicker` that prevents the user from selecting any Sundays,
by using the component in controlled mode and with the `modifiers` prop:

```css.scss
// in CSS
.#{$ns}-datepicker .DayPicker-Day--isSunday {
  // CSS rules to make the day appear disabled
}
```

```tsx
// in TypeScript
export class DatePickerExample extends React.Component<{}, { selectedDate: Date }> {
    public state = { selectedDate: new Date() };

    public render() {
        // name of modifier function becomes the suffix for the CSS class above
        const modifiers = { isSunday };
        return (
            <DatePicker
                modifiers={modifiers}
                onChange={(newDate) => this.handleChange(newDate)}
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

@## Props

`DatePicker` supports both controlled and uncontrolled usage. You can control
the selected day by setting the `value` prop, or use the component in
uncontrolled mode and specify an initial day by setting `defaultValue`. Use the
`onChange` prop to listen for changes to the selected day.

Some props are managed by the `DatePicker` component, while others are passed
to the **react-day-picker** library. These passed props are documented in full
in the [**react-day-picker** documentation](http://www.gpbl.org/react-day-picker/index.html).

@interface IDatePickerProps

@## Localization

`DatePicker`, `DateRangePicker`, `DateInput`, and `DateRangeInput` all support localization using an interface defined in the
`react-day-picker` module:

```tsx
import { LocaleUtils } from "react-day-picker";
```

By supplying a `locale: string` and `localeUtils: LocaleUtils` prop to these Blueprint components, you can
customize how dates are rendered, which day of the week is the first column, etc.
[See the interface definition for more details](https://github.com/gpbl/react-day-picker/blob/v7.3.0/types/utils.d.ts#L5).

Although `@blueprintjs/datetime` and `react-day-picker` do not explicitly require `moment.js` as a dependency,
you may wish to use Moment's implementation of localization so that you do not have to write these functions yourself.
The import from `react-day-picker` shown above gives you a utility object containing functions which do just that; you
may use it like so:

```tsx
<DatePicker locale="fr" localeUtils={LocaleUtils} />
```
