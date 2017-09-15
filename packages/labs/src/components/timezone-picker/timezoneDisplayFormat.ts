/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as moment from "moment-timezone";
import { getTimezoneMetadata } from "./timezoneMetadata";

export type TimezoneDisplayFormat = "offset" | "abbreviation" | "name" | "composite";
export const TimezoneDisplayFormat = {
    ABBREVIATION: "abbreviation" as "abbreviation",
    COMPOSITE: "composite" as "composite",
    NAME: "name" as "name",
    OFFSET: "offset" as "offset",
};

export function formatTimezone(
    timezone: string | undefined,
    date: Date,
    displayFormat: TimezoneDisplayFormat,
): string | undefined {
    if (!timezone || !moment.tz.zone(timezone)) {
        return undefined;
    }

    const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone, date);
    switch (displayFormat) {
        case TimezoneDisplayFormat.ABBREVIATION:
            // Fall back to the offset in regions where there is no abbreviation.
            return abbreviation ? abbreviation : offsetAsString;
        case TimezoneDisplayFormat.NAME:
            return timezone;
        case TimezoneDisplayFormat.OFFSET:
            return offsetAsString;
        case TimezoneDisplayFormat.COMPOSITE:
            return `${timezone}${abbreviation ? ` (${abbreviation})` : ""} ${offsetAsString}`;
        default:
            assertNever(displayFormat);
            return undefined;
    }
}

function assertNever(x: never): never {
    throw new Error("Unexpected value: " + x);
}
