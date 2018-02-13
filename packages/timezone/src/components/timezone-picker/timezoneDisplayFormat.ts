/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as moment from "moment-timezone";
import { getTimezoneMetadata } from "./timezoneMetadata";

export type TimezoneDisplayFormat = "offset" | "abbreviation" | "name" | "composite";
export const TimezoneDisplayFormat = {
    /** Abbreviation format: `"HST"` */
    ABBREVIATION: "abbreviation" as "abbreviation",
    /** Composite format: `"Pacific/Honolulu (HST) -10:00"` */
    COMPOSITE: "composite" as "composite",
    /** Name format: `"Pacific/Honolulu"` */
    NAME: "name" as "name",
    /** Offset format: `"-10:00"` */
    OFFSET: "offset" as "offset",
};

export function formatTimezone(timezone: string, date: Date, displayFormat: TimezoneDisplayFormat): string | undefined {
    if (!timezone || !moment.tz.zone(timezone)) {
        return undefined;
    }

    const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone, date);
    switch (displayFormat) {
        case TimezoneDisplayFormat.ABBREVIATION:
            // Fall back to the offset when there is no abbreviation.
            return abbreviation !== undefined ? abbreviation : offsetAsString;
        case TimezoneDisplayFormat.NAME:
            return timezone;
        case TimezoneDisplayFormat.OFFSET:
            return offsetAsString;
        case TimezoneDisplayFormat.COMPOSITE:
            return `${timezone}${abbreviation ? ` (${abbreviation})` : ""} ${offsetAsString}`;
    }
}
