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

@## Basic example

@reactExample TimezoneSelectBasicExample

@## Basic usage

```tsx
import { TimezoneSelect } from "@blueprintjs/core";

export interface ITimezoneExampleState {
    timezone: string;
}

export class TimezoneExample extends React.PureComponent<{}, ITimezoneExampleState> {
    public state: ITimezoneExampleState = {};

    public render() {
        return (
            <TimezoneSelect
                value={this.state.timezone}
                onChange={this.handleTimezoneChange}
            />
        );
    }

    private handleTimezoneChange = (timezone: string) => {
        this.setState({ timezone });
    }
}
```

@## Extended example

@reactExample TimezoneSelectExtendedExample

@## JavaScript API

@interface ITimezoneSelectProps

@interface ITimezoneSelectTargetProps
