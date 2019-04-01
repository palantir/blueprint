/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
