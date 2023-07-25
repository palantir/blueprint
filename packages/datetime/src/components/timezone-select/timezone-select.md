@# Timezone select

__TimezoneSelect__ allows the user to select from a list of timezones. The list is built into the library itself, so it
does not depend on any external packages for the list of timezones. It uses
[date-fns-tz](https://github.com/marnusw/date-fns-tz) for display formatting.

@reactExample TimezoneSelectExample

@## Usage

This component only supports __controlled__ usage.

Control the selected timezone with the `value` prop and use the `onChange` prop callback to listen for changes to the
selected timezone.

```tsx
import { TimezoneSelect } from "@blueprintjs/datetime";
import React, { useState } from "react";

function TimezoneExample() {
    const [timezone, setTimezone] = useState("");
    return (
        <TimezoneSelect value={timezone} onChange={setTimezone} />
    );
}
```

The optional `date` prop is used to determine the timezone offsets. This is useful to disambiguate timezones which have
more than one offset from UTC due to [Daylight saving time](https://en.wikipedia.org/wiki/Daylight_saving_time).

By default, the component will show a clickable button target which displays the selected timezone formatted according
to the `valueDisplayFormat` prop. The button can be customized via `disabled`, `placeholder`, and more generally via
`buttonProps`.

You can show a custom element instead of the default button by passing a single-element child to `<TimezoneSelect>`;
in this case, all button-specific props will be ignored:

```tsx
<TimezoneSelect value={...} onChange={...}>
    <Icon icon="globe" />
</TimezonePicker>
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Local timezone detection</h5>

__TimezoneSelect__ detects the local timezone using the
[i18n API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions)
when the `showLocalTimezone` prop is enabled and cannot guarantee correctness in all browsers.

</div>

@## Props interface

@interface TimezoneSelectProps
