@# Timezone Input

`TimezoneInput` allows the user to input a timezone by selecting from a list of timezones.

A `date` is required to determine the timezone offsets.
This is because a timezone usually has more than one offset from UTC due to daylight saving time.
See [here](https://momentjs.com/guides/#/lib-concepts/timezone-offset/)
and [here](http://momentjs.com/timezone/docs/#/using-timezones/parsing-ambiguous-inputs/)
for more information.

[Moment Timezone](http://momentjs.com/timezone/) is used internally,
for the list of available timezones and timezone metadata.

The initial list (shown before filtering) shows one timezone per timezone offset,
using the most populous location for each offset.
Moment Timezone uses this same heuristic for [guessing](http://momentjs.com/timezone/docs/#/using-timezones/guessing-user-timezone/) the user's timezone.

@reactExample TimezoneInputExample

```tsx
import { TimezoneInput } from "@blueprintjs/core";

export interface ITimezoneExampleState {
    date: Date;
}

export class TimezoneExample extends React.PureComponent<{}, ITimezoneExampleState> {
    public state: ITimezoneExampleState = {
        date: new Date(),
    };

    public render() {
        return (
            <TimezoneInput
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

@interface ITimezoneInputProps
