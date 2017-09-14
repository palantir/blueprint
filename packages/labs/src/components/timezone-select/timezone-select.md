@# Timezone Select

`TimezoneSelect` allows the user select from a list of timezones.

[Moment Timezone](http://momentjs.com/timezone/) is used internally,
for the list of available timezones and timezone metadata.

This component can be used in controlled or uncontrolled mode.
Use the `onChange` prop to listen for changes to the selected timezone.
You can control the selected timezone by setting the `value` prop.
Or, use the component in uncontrolled mode and specify an initial timezone by setting `defaultValue`.

The `date` prop is used to determine the timezone offsets.
This is because a timezone usually has more than one offset from UTC due to daylight saving time.
See [here](https://momentjs.com/guides/#/lib-concepts/timezone-offset/)
and [here](http://momentjs.com/timezone/docs/#/using-timezones/parsing-ambiguous-inputs/)
for more information.

The initial list (shown before filtering) shows one timezone per timezone offset,
using the most populous location for each offset.
Moment Timezone uses a similar heuristic for
[guessing](http://momentjs.com/timezone/docs/#/using-timezones/guessing-user-timezone/) the user's timezone.

Note about `defaultToLocalTimezone` and `showLocalTimezone`:
We cannot guarantee that we'll get the correct local timezone in all browsers.
In supported browsers, the Internationalization API is used.
In other browsers, Date methods and a population heuristic are used.
See [Moment Timezone's documentation](https://momentjs.com/timezone/docs/#/using-timezones/guessing-user-timezone/)
for more information.

@reactExample TimezoneSelectExample

```tsx
import { TimezoneSelect } from "@blueprintjs/core";

export interface ITimezoneExampleState {
    date: Date;
}

export class TimezoneExample extends React.PureComponent<{}, ITimezoneExampleState> {
    public state: ITimezoneExampleState = {
        date: new Date(),
    };

    public render() {
        return (
            <TimezoneSelect
                date={this.state.date}
                onTimezoneSelect={this.handleTimezoneSelect}
            />
        );
    }

    private handleTimezoneSelect = (timezone: string) => {
        console.log("Selected timezone:", timezone);
    }
}
```

@## JavaScript API

@interface ITimezoneSelectProps

@interface ITimezoneSelectTargetProps
