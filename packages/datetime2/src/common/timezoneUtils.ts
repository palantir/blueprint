/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { isEmpty } from "lodash-es";

import { TimePrecision } from "@blueprintjs/datetime";

import { getCurrentTimezone } from "./getTimezone";

const NO_TIME_PRECISION = "date";
const UTC_IANA_LABEL = "Etc/UTC";

const TIME_FORMAT_TO_ISO_FORMAT: Record<TimePrecision | "date", string> = {
    [TimePrecision.MILLISECOND]: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
    [TimePrecision.SECOND]: "yyyy-MM-dd'T'HH:mm:ssxxx",
    [TimePrecision.MINUTE]: "yyyy-MM-dd'T'HH:mmxxx",
    [NO_TIME_PRECISION]: "yyyy-MM-dd",
};

/**
 * @see https://github.com/marnusw/date-fns-tz#formatintimezone
 * @returns a string of tokens which tell date-fns-tz's formatInTimeZone how to render a datetime
 */
function getFormatStr(timePrecision: TimePrecision | undefined): string {
    return TIME_FORMAT_TO_ISO_FORMAT[timePrecision ?? NO_TIME_PRECISION];
}

export function getIsoEquivalentWithUpdatedTimezone(
    date: Date,
    timezone: string,
    timePrecision: TimePrecision | undefined,
): string {
    const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(date, timezone);
    return formatInTimeZone(convertedDate, timezone, getFormatStr(timePrecision));
}

/**
 * HACKHACK: this method relies on parsing strings with the `Date()` constructor, which is discouraged
 * by the MDN documentation and the Moment.js status page. If we continue to use this approach, we need
 * to validate that input strings conform to the ISO 8601 format.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#parameters
 * @see https://momentjs.com/docs/#/-project-status/
 *
 * @param value ISO string representation of a date
 * @param timezone target timezone IANA code
 */
export function getDateObjectFromIsoString(value: string | undefined, timezone: string): Date | undefined;
export function getDateObjectFromIsoString(value: string | null | undefined, timezone: string): Date | null | undefined;
export function getDateObjectFromIsoString(
    value: string | null | undefined,
    timezone: string,
): Date | null | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (value === null || isEmpty(value)) {
        return null;
    }
    const date = new Date(value);
    // If the value is just a date format then we convert it to midnight in local time to avoid weird things happening
    if (value.length === 10) {
        // If it's just a date, we know it's interpreted as midnight UTC so we convert it to local time of that UTC time
        return convertLocalDateToTimezoneTime(date, UTC_IANA_LABEL);
    }
    return convertLocalDateToTimezoneTime(date, timezone);
}
/**
 * Converts a date in local timezone to represent better the passed through timezone
 * representation for the user, meaning if 8 AM local time is currently the date, and local time is Oslo
 * and the user has a default of UTC in selection, the new date should represent 7 AM.
 *
 * @param date the current existing date object
 * @param newTimezone the new timezone that we need to update the date to represent
 * @returns The date converted to match the new timezone
 */
export function convertLocalDateToTimezoneTime(date: Date, newTimezone: string) {
    const nowUtc = zonedTimeToUtc(date, getCurrentTimezone());
    return utcToZonedTime(nowUtc, newTimezone);
}

/**
 * Converts a date to match a new timezone selection. The date is the internal local time
 * representation for the user, meaning if 8 AM local time is currently selected, and local time is Oslo
 * and the user switches timezone to UTC, the new date should represent 9 AM in Oslo time.
 *
 * @param date the current existing date object
 * @param newTimezone the new timezone that the date should be converted to represent
 * @returns The date converted to match the new timezone
 */
export function convertDateToLocalEquivalentOfTimezoneTime(date: Date, newTimezone: string) {
    const nowUtc = zonedTimeToUtc(date, newTimezone);
    return utcToZonedTime(nowUtc, getCurrentTimezone());
}
