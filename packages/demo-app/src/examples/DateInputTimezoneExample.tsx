/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { memo, useCallback, useMemo, useState } from "react";

import { Pre } from "@blueprintjs/core";
import { DateInput, MINIMAL_TIMEZONES, TimePrecision } from "@blueprintjs/datetime";

import { ExampleCard } from "./ExampleCard";

/**
 * Converts offset string like "-08:00" or "+05:30" to minutes.
 */
function offsetStringToMinutes(offset: string): number {
    const match = offset.match(/([+-])(\d{2}):?(\d{2})/);
    if (!match) {
        return 0;
    }
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);
    return sign * (hours * 60 + minutes);
}

/**
 * Extracts the UTC offset from an ISO 8601 datetime string and returns it in minutes.
 * Returns undefined if no offset is present.
 *
 * @example
 * parseOffsetFromISOString("2025-12-01T00:00-08:00") // returns -480
 * parseOffsetFromISOString("2025-12-01T00:00+05:30") // returns 330
 * parseOffsetFromISOString("2025-12-01T00:00Z") // returns 0
 */
function parseOffsetFromISOString(isoString: string): number | undefined {
    // Match timezone offset at the end: Z, +HH:MM, -HH:MM, +HHMM, -HHMM
    const match = isoString.match(/([+-]\d{2}:?\d{2})$|Z$/);
    if (!match) {
        return undefined;
    }
    if (match[0] === "Z") {
        return 0;
    }
    return offsetStringToMinutes(match[1]);
}

/**
 * Finds a timezone from the list that matches the given offset in minutes.
 * Returns the IANA code of the first matching timezone, or undefined if none found.
 */
function findTimezoneByOffset(offsetMinutes: number): string | undefined {
    const match = MINIMAL_TIMEZONES.find(tz => offsetStringToMinutes(tz.offset) === offsetMinutes);
    return match?.ianaCode;
}

/**
 * Given an ISO datetime string, returns a matching timezone IANA code.
 * Falls back to the provided default if no match is found.
 */
function getTimezoneFromISOString(isoString: string | null, defaultTimezone: string): string {
    if (!isoString) {
        return defaultTimezone;
    }
    const offsetMinutes = parseOffsetFromISOString(isoString);
    if (offsetMinutes === undefined) {
        return defaultTimezone;
    }
    return findTimezoneByOffset(offsetMinutes) ?? defaultTimezone;
}

const WIDTH = 350;

// Simulate a value that might come from a database or API with a Pacific timezone offset
const INITIAL_VALUE = "2025-12-01T00:00-08:00";
const DEFAULT_TIMEZONE = "America/New_York";

export const DateInputTimezoneExample = memo(() => {
    // Initialize timezone from the ISO string's offset instead of hardcoding
    const initialTimezone = useMemo(() => getTimezoneFromISOString(INITIAL_VALUE, DEFAULT_TIMEZONE), []);

    const [value, setValue] = useState<string | null>(INITIAL_VALUE);
    const [timezone, setTimezone] = useState<string>(initialTimezone);

    const handleChange = useCallback((newValue: string | null) => {
        setValue(newValue);
    }, []);

    const handleTimezoneChange = useCallback((newTimezone: string) => {
        setTimezone(newTimezone);
    }, []);

    return (
        <ExampleCard width={WIDTH} horizontal={false} label="DateInput with timezone persistence">
            <DateInput
                onChange={handleChange}
                onTimezoneChange={handleTimezoneChange}
                timePrecision={TimePrecision.MINUTE}
                timezone={timezone}
                value={value}
            />
            <Pre style={{ margin: 0 }}>value: {value ?? "null"}</Pre>
            <Pre style={{ margin: 0 }}>timezone: {timezone}</Pre>
        </ExampleCard>
    );
});

DateInputTimezoneExample.displayName = "DemoApp.DateInputTimezoneExample";
