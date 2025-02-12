/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { getTimezoneOffset } from "date-fns-tz";

import type { Timezone, TimezoneWithoutOffset } from "./timezoneTypes";

/**
 * Augment hard-coded timezone information stored in this package with its current offset relative to UTC,
 * adjusted for daylight saving using the current date.
 *
 * @see https://github.com/marnusw/date-fns-tz#gettimezoneoffset
 */
export function lookupTimezoneOffset(tz: TimezoneWithoutOffset, date?: Date): Timezone {
    const offsetInMs = getTimezoneOffset(tz.ianaCode, date);
    if (isNaN(offsetInMs)) {
        throw new Error(`Unable to lookup offset for invalid timezone '${tz.ianaCode}'`);
    }

    const isPositiveOffset = offsetInMs >= 0;
    const offsetInMinutes = Math.abs(offsetInMs) / 1000 / 60;
    const offsetHours = Math.trunc(offsetInMinutes / 60)
        .toString()
        .padStart(2, "0");
    const offsetMinutes = (offsetInMinutes % 60).toString().padEnd(2, "0");
    return {
        ...tz,
        offset: `${isPositiveOffset ? "+" : "-"}${offsetHours}:${offsetMinutes}`,
    };
}
