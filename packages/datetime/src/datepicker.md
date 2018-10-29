@# Date picker

A `DatePicker` shows a monthly calendar and allows the user to choose a single date.

`DatePicker` is built on top of the [**react-day-picker**](https://github.com/gpbl/react-day-picker) library.

@reactExample DatePickerExample

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
