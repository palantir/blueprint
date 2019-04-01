/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import * as Classes from "./classes";
import { get12HourFrom24Hour, get24HourFrom12Hour } from "./dateUtils";

/** describes a component of time. `H:MM:SS.MS` */
export enum TimeUnit {
    // NOTE: string enum so we can use it in Record<> type at the end of this file, which requires string keys
    HOUR_24 = "hour24",
    HOUR_12 = "hour12",
    MINUTE = "minute",
    SECOND = "second",
    MS = "ms",
}

/** Returns the given time unit component of the date. */
export function getTimeUnit(unit: TimeUnit, date: Date) {
    switch (unit) {
        case TimeUnit.HOUR_24:
            return date.getHours();
        case TimeUnit.HOUR_12:
            return get12HourFrom24Hour(date.getHours());
        case TimeUnit.MINUTE:
            return date.getMinutes();
        case TimeUnit.SECOND:
            return date.getSeconds();
        case TimeUnit.MS:
            return date.getMilliseconds();
        default:
            throw Error("Invalid TimeUnit");
    }
}

/** Sets the given time unit to the given time in date object. Modifies given `date` object and returns it. */
export function setTimeUnit(unit: TimeUnit, time: number, date: Date, isPm: boolean) {
    switch (unit) {
        case TimeUnit.HOUR_24:
            date.setHours(time);
            break;
        case TimeUnit.HOUR_12:
            date.setHours(get24HourFrom12Hour(time, isPm));
            break;
        case TimeUnit.MINUTE:
            date.setMinutes(time);
            break;
        case TimeUnit.SECOND:
            date.setSeconds(time);
            break;
        case TimeUnit.MS:
            date.setMilliseconds(time);
            break;
        default:
            throw Error("Invalid TimeUnit");
    }
    return date;
}

/** Returns true if `time` is a valid value */
export function isTimeUnitValid(unit: TimeUnit, time?: number) {
    return time != null && !isNaN(time) && getTimeUnitMin(unit) <= time && time <= getTimeUnitMax(unit);
}

/** If unit of time is greater than max, returns min. If less than min, returns max. Otherwise, returns time. */
export function wrapTimeAtUnit(unit: TimeUnit, time: number) {
    const max = getTimeUnitMax(unit);
    const min = getTimeUnitMin(unit);

    if (time > max) {
        return min;
    } else if (time < min) {
        return max;
    }
    return time;
}

export function getTimeUnitClassName(unit: TimeUnit) {
    return TimeUnitMetadata[unit].className;
}

export function getTimeUnitMax(unit: TimeUnit) {
    return TimeUnitMetadata[unit].max;
}

export function getTimeUnitMin(unit: TimeUnit) {
    return TimeUnitMetadata[unit].min;
}

export function getDefaultMinTime(): Date {
    return new Date(0, 0, 0, DEFAULT_MIN_HOUR, DEFAULT_MIN_MINUTE, DEFAULT_MIN_SECOND, DEFAULT_MIN_MILLISECOND);
}

export function getDefaultMaxTime(): Date {
    return new Date(0, 0, 0, DEFAULT_MAX_HOUR, DEFAULT_MAX_MINUTE, DEFAULT_MAX_SECOND, DEFAULT_MAX_MILLISECOND);
}

interface ITimeUnitMetadata {
    className: string;
    max: number;
    min: number;
}

const DEFAULT_MIN_HOUR = 0;
const MERIDIEM_MIN_HOUR = 1;
const DEFAULT_MIN_MINUTE = 0;
const DEFAULT_MIN_SECOND = 0;
const DEFAULT_MIN_MILLISECOND = 0;

const DEFAULT_MAX_HOUR = 23;
const MERIDIEM_MAX_HOUR = 12;
const DEFAULT_MAX_MINUTE = 59;
const DEFAULT_MAX_SECOND = 59;
const DEFAULT_MAX_MILLISECOND = 999;

/**
 * A datastore (internal to this file) mapping TimeUnits to useful information about them.
 * Use the `get*` methods above to access these fields.
 */
const TimeUnitMetadata: Record<TimeUnit, ITimeUnitMetadata> = {
    [TimeUnit.HOUR_24]: {
        className: Classes.TIMEPICKER_HOUR,
        max: DEFAULT_MAX_HOUR,
        min: DEFAULT_MIN_HOUR,
    },
    [TimeUnit.HOUR_12]: {
        className: Classes.TIMEPICKER_HOUR,
        max: MERIDIEM_MAX_HOUR,
        min: MERIDIEM_MIN_HOUR,
    },
    [TimeUnit.MINUTE]: {
        className: Classes.TIMEPICKER_MINUTE,
        max: DEFAULT_MAX_MINUTE,
        min: DEFAULT_MIN_MINUTE,
    },
    [TimeUnit.SECOND]: {
        className: Classes.TIMEPICKER_SECOND,
        max: DEFAULT_MAX_SECOND,
        min: DEFAULT_MIN_SECOND,
    },
    [TimeUnit.MS]: {
        className: Classes.TIMEPICKER_MILLISECOND,
        max: DEFAULT_MAX_MILLISECOND,
        min: DEFAULT_MIN_MILLISECOND,
    },
};
