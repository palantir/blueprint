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

import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

import { getTimezone } from "./getTimezone";

/**
 * converts a date in local timezone to represent better the passed through timezone
 * representation for the user, meaning if 8 AM local time is currently the date, and local time is Oslo
 * and the user has a default of UTC in selection, the new date should represent 7 AM
 *
 * @param date the current existing date object
 * @param newTimezone the new timezone that we need to update the date to represent
 * @returns The date converted to match the new timezone
 */
export function convertLocalDateToTimezoneTime(date: Date, newTimezone: string) {
    const nowUtc = zonedTimeToUtc(date, getTimezone());
    return utcToZonedTime(nowUtc, newTimezone);
}

/**
 * converts a date to match a new timezone selection. The date is the internal local time
 * representation for the user, meaning if 8 AM local time is currently selected, and local time is Oslo
 * and the user switches timezone to UTC, the new date should represent 9 AM in Oslo time.
 *
 * @param date the current existing date object
 * @param newTimezone the new timezone that the date should be converted to represent
 * @returns The date converted to match the new timezone
 */
export function convertDateToLocalEquivalentOfTimezoneTime(date: Date, newTimezone: string) {
    const nowUtc = zonedTimeToUtc(date, newTimezone);
    const utcToZoned = utcToZonedTime(nowUtc, getTimezone());
    return utcToZoned;
}
