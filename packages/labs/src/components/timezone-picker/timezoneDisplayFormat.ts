/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as moment from "moment-timezone";

export type TimezoneDisplayFormat = "offset" | "abbreviation" | "name";
export const TimezoneDisplayFormat = {
    ABBREVIATION: "abbreviation" as "abbreviation",
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

    switch (displayFormat) {
        case TimezoneDisplayFormat.ABBREVIATION:
            return moment.tz(date.getTime(), timezone).format("z");
        case TimezoneDisplayFormat.NAME:
            return timezone;
        case TimezoneDisplayFormat.OFFSET:
            return moment.tz(date.getTime(), timezone).format("Z");
        default:
            assertNever(displayFormat);
            return "";
    }
}

function assertNever(x: never): never {
    throw new Error("Unexpected value: " + x);
}
