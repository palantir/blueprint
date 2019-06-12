/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { assert } from "chai";
import { ReactWrapper } from "enzyme";
import * as Classes from "../../src/common/classes";

/**
 * Converts a `Date` to a "D/M/YYYY" string.
 * Do not use `YYYY-MM-DD` format in tests as JS Dates interpret that as UTC and the parsed Date can be a day before intended.
 */
export function toDateString(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-indexed => 1-indexed
    const day = date.getDate();
    return [month, day, year].join("/");
}

/**
 * Creates a date object with time only.
 */
export function createTimeObject(hour: number, minute: number = 0, second: number = 0, millisecond: number = 0) {
    const IGNORED_YEAR = 1995;
    const IGNORED_MONTH = 6;
    const IGNORED_DAY = 30;
    return new Date(IGNORED_YEAR, IGNORED_MONTH, IGNORED_DAY, hour, minute, second, millisecond);
}

const isDayHidden = (day: ReactWrapper<any, any>): boolean =>
    day.prop("empty") && !day.prop("ariaSelected") && day.prop("ariaDisabled");

export function assertTimeIs(time: Date, hours: number, minutes: number, seconds?: number, milliseconds?: number) {
    assert.strictEqual(time.getHours(), hours);
    assert.strictEqual(time.getMinutes(), minutes);
    if (seconds != null) {
        assert.strictEqual(time.getSeconds(), seconds);
    }
    if (milliseconds != null) {
        assert.strictEqual(time.getMilliseconds(), milliseconds);
    }
}

export function assertDatesEqual(a: Date, b: Date) {
    assert.isTrue(a.getDay() === b.getDay() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear());
}

export function assertDayDisabled(day: ReactWrapper<any, any>, expectDisabled: boolean = true) {
    assert.equal(day.hasClass(Classes.DATEPICKER_DAY_DISABLED), expectDisabled);
}

export function assertDayHidden(day: ReactWrapper<any, any>, expectHidden: boolean = true) {
    assert.equal(isDayHidden(day), expectHidden);
}
