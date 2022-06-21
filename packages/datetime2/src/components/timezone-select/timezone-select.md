---
tag: new
---

@# TimezoneSelect

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [TimezonePicker](#timezone/timezone-picker)?

</h4>

TimezoneSelect is a replacement for [TimezonePicker component](#timezone/timezone-picker) from
the [__@blueprintjs/timezone__ package](#timezone) and will replace it in Blueprint v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [migration guide](https://github.com/palantir/blueprint/wiki/datetime2-component-migration)
on the wiki.

</div>

`TimezoneSelect` allows the user to select from a list of timezones. The list is coded into the library itself, so it does not depend on any external packages for the list of timezones.

@reactExample TimezoneSelectExample

@## Props

This component only supports controlled usage.
Control the selected timezone with the `value` prop.
Use the `onChange` prop to listen for changes to the selected timezone.

The `date` prop is used to determine the timezone offsets.
This is because a timezone usually has more than one offset from UTC due to daylight saving time.

By default, the component will show a clickable button target,
which will display the selected timezone formatted according to `valueDisplayFormat`.
The button can also be managed via `disabled`, `placeholder`, and more generally via `buttonProps`.
You can show a custom element instead of the default button by passing a single-element child; in this case,
all button-specific props will be ignored:

```tsx
<TimezoneSelect value={...} onChange={...}>
    <Icon icon="globe" />
</TimezonePicker>
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Local timezone detection</h4>

We detect the local timezone using the
[i18n API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions)
when the `showLocalTimezone` prop is enabled and cannot guarantee correctness
in all browsers.
</div>

```tsx
import { TimezoneSelect } from "@blueprintjs/datetime2";

export class TimezoneExample extends React.PureComponent<{}, { timezone: string; }> {
    public state = { timezone: "" };

    public render() {
        return <TimezoneSelect value={this.state.timezone} onChange={this.handleTimezoneChange} />;
    }

    private handleTimezoneChange = (timezone: string) => this.setState({ timezone });
}
```

@interface TimezoneSelectProps
