@# TimezonePicker

`TimezonePicker` allows the user to select from a list of timezones.

[Moment Timezone](http://momentjs.com/timezone/) is used internally for the list of available timezones and
timezone metadata.

@reactExample TimezonePickerExample

@## Props

This component only supports controlled usage.
Control the selected timezone with the `value` prop.
Use the `onChange` prop to listen for changes to the selected timezone.

The `date` prop is used to determine the timezone offsets.
This is because a timezone usually has more than one offset from UTC due to daylight saving time.
See [here](https://momentjs.com/guides/#/lib-concepts/timezone-offset/)
and [here](http://momentjs.com/timezone/docs/#/using-timezones/parsing-ambiguous-inputs/)
for more information.

The initial list (shown before filtering) shows one timezone per timezone offset,
using the most populous location for each offset.
Moment Timezone uses a similar [heuristic for guessing](http://momentjs.com/timezone/docs/#/using-timezones/guessing-user-timezone/)
the user's timezone.

By default, the component will show a clickable button target,
which will display the selected timezone formatted according to `valueDisplayFormat`.
The button can also be managed via `disabled`, `placeholder`, and more generally via `buttonProps`.
You can show a custom element instead of the default button by passing a single-element child; in this case,
all button-specific props will be ignored:

```tsx
<TimezonePicker value={...} onChange={...}>
    <Icon icon="globe" />
</TimezontPicker>
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Local timezone detection</h4>

We detect the local timezone when the `showLocalTimezone` prop is enabled and cannot guarantee correctness in all browsers.
In supported browsers, the [i18n API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions) is used.
In other browsers, `Date` methods and a population heuristic are used.
See [Moment Timezone's documentation](https://momentjs.com/timezone/docs/#/using-timezones/guessing-user-timezone/)
for more information and browser compatibility.
</div>

```tsx
import { TimezonePicker } from "@blueprintjs/timezone";

export class TimezoneExample extends React.PureComponent<{}, { timezone: string; }> {
    public state = { timezone: "" };

    public render() {
        return <TimezonePicker value={this.state.timezone} onChange={this.handleTimezoneChange} />;
    }

    private handleTimezoneChange = (timezone: string) => this.setState({ timezone });
}
```

@interface ITimezonePickerProps
