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

import { assertTimeIs, createTimeObject } from "@blueprintjs/test-commons";
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import type { DateRange } from "../common/dateRange";

import * as DateUtils from "./dateUtils";
import { Months } from "./months";

describe("DateUtils", () => {
    it("should return true for isSameTime when times match", () => {
        const d1 = new Date(2022, Months.JULY, 8);
        const d2 = new Date(2022, Months.JULY, 8);
        const d3 = new Date(2022, Months.JULY, 9);
        expect(DateUtils.isSameTime(d1, d2)).toBe(true);
        expect(DateUtils.isSameTime(d1, d3)).toBe(true);
    });

    it("should return true for isDayInRange when day is within range", () => {
        const d1 = new Date(2022, Months.JULY, 7);
        const d2 = new Date(2022, Months.JULY, 8);
        const d3 = new Date(2022, Months.JULY, 9);
        expect(DateUtils.isDayInRange(d2, [d1, d3])).toBe(true);
    });

    describe("areRangesEqual", () => {
        const DATE_1 = new Date(2017, Months.JANUARY, 1);
        const DATE_2 = new Date(2017, Months.JANUARY, 2);
        const DATE_3 = new Date(2017, Months.JANUARY, 3);
        const DATE_4 = new Date(2017, Months.JANUARY, 4);

        describe("should return true for", () => {
            runTest("null and null", null, null, true);
            runTest("[null, null] and [null, null]", [null, null], [null, null], true);
            runTest("[DATE_1, DATE_2] and [DATE_1, DATE_2]", [DATE_1, DATE_2], [DATE_1, DATE_2], true);
        });

        describe("should return false for", () => {
            runTest("null and [null, null]", null, [null, null], false);
            runTest("[DATE_1, null] and [DATE_2, null]", [DATE_1, null], [DATE_2, null], false);
            runTest("[DATE_1, null] and [null, null]", [DATE_1, null], [null, null], false);
            runTest("[DATE_1, DATE_2] and [DATE_1, DATE_4]", [DATE_1, DATE_2], [DATE_1, DATE_4], false);
            runTest("[DATE_1, DATE_4] and [DATE_2, DATE_4]", [DATE_1, DATE_4], [DATE_2, DATE_4], false);
            runTest("[DATE_1, DATE_2] and [DATE_3, DATE_4]", [DATE_1, DATE_2], [DATE_3, DATE_4], false);
        });

        function runTest(
            description: string,
            dateRange1: DateRange | null,
            dateRange2: DateRange | null,
            expectedResult: boolean,
        ) {
            it(description, () => {
                expect(DateUtils.areRangesEqual(dateRange1, dateRange2)).toBe(expectedResult);
            });
        }
    });

    it("should return Date object with constant year, month, and day from getDateOnlyWithTime", () => {
        const time = DateUtils.getDateOnlyWithTime(createTimeObject(14, 10, 10, 600));

        expect(time.getFullYear()).toBe(1899);
        expect(time.getMonth()).toBe(11);
        expect(time.getDay()).toBe(0);

        expect(time.getHours()).toBe(14);
        expect(time.getMinutes()).toBe(10);
        expect(time.getSeconds()).toBe(10);
        expect(time.getMilliseconds()).toBe(600);
    });

    describe("isTimeSameOrAfter", () => {
        it("should return true if given time is greater than another time", () => {
            const time = createTimeObject(14, 22, 30, 600);
            const time2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(time, time2)).toBe(true);
        });

        it("should return true if given time is equal to another time", () => {
            const time = createTimeObject(14, 20, 30, 600);
            const time2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(time, time2)).toBe(true);
        });

        it("should return false if given time is smaller than another time", () => {
            const time = createTimeObject(14, 10, 50, 900);
            const time2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(time, time2)).toBe(false);
        });
    });

    describe("isTimeEqualOrGreaterThan", () => {
        it("should return true if time is greater than another time", () => {
            const time = createTimeObject(14, 20);
            const time2 = createTimeObject(14, 10);

            expect(DateUtils.isTimeEqualOrGreaterThan(time, time2)).toBe(true);
        });

        it("should return true if time is greater than or equal to another time", () => {
            const time = createTimeObject(14, 10);
            const time2 = createTimeObject(14, 10);

            expect(DateUtils.isTimeEqualOrGreaterThan(time, time2)).toBe(true);
        });

        it("should return false if time is smaller than another time", () => {
            const time = createTimeObject(12, 10);
            const time2 = createTimeObject(13, 10);

            expect(DateUtils.isTimeEqualOrGreaterThan(time, time2)).toBe(false);
        });
    });

    describe("isTimeEqualOrSmallerThan", () => {
        it("should return true if time is smaller than another time", () => {
            const time = createTimeObject(10, 10);
            const time2 = createTimeObject(14, 10);

            expect(DateUtils.isTimeEqualOrSmallerThan(time, time2)).toBe(true);
        });

        it("should return true if time is equal to another time", () => {
            const time = createTimeObject(14, 10);
            const time2 = createTimeObject(14, 10);

            expect(DateUtils.isTimeEqualOrSmallerThan(time, time2)).toBe(true);
        });

        it("should return false if time is greater than another time", () => {
            const time = createTimeObject(14, 10);
            const time2 = createTimeObject(13, 10);

            expect(DateUtils.isTimeEqualOrSmallerThan(time, time2)).toBe(false);
        });
    });

    describe("isTimeInRange", () => {
        // Note that year, month, and day are always ignored
        const minTime = createTimeObject(14, 20, 30, 600);
        const maxTime = createTimeObject(18, 40, 10, 200);

        it("should return true if given time is in range", () => {
            const time = createTimeObject(17, 0, 0, 0);
            expect(DateUtils.isTimeInRange(time, minTime, maxTime)).toBe(true);
        });

        it("should return true if given time is in range, and minTime > maxTime", () => {
            const minTimeBeforeMidnight = createTimeObject(22, 0, 0, 0);
            const maxTimeAfterMidnight = createTimeObject(2, 0, 0, 0);

            const timeAfterMidnight = createTimeObject(1, 0, 0, 0);
            expect(DateUtils.isTimeInRange(timeAfterMidnight, minTimeBeforeMidnight, maxTimeAfterMidnight)).toBe(true);

            const timeBeforeMidnight = createTimeObject(23, 0, 0, 0);
            expect(DateUtils.isTimeInRange(timeBeforeMidnight, minTimeBeforeMidnight, maxTimeAfterMidnight)).toBe(true);
        });

        it("should return false if given time is not in range, and minTime > maxTime", () => {
            const minTimeBeforeMidnight = createTimeObject(22, 0, 0, 0);
            const maxTimeAfterMidnight = createTimeObject(2, 0, 0, 0);

            const time = createTimeObject(16, 0, 0, 0);
            expect(DateUtils.isTimeInRange(time, minTimeBeforeMidnight, maxTimeAfterMidnight)).toBe(false);
        });

        it("should return false if given time is smaller than minTime", () => {
            const time = createTimeObject(13, 10, 50, 900);
            expect(DateUtils.isTimeInRange(time, minTime, maxTime)).toBe(false);
        });

        it("should return false if given time is greater than maxTime", () => {
            const time = createTimeObject(18, 41, 9, 50);
            expect(DateUtils.isTimeInRange(time, minTime, maxTime)).toBe(false);
        });
    });

    describe("getTimeInRange", () => {
        it("should return given time, if it's between minTime and MaxTime", () => {
            const timeInRange = createTimeObject(14, 10);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeInRange, minTime, maxTime);
            assertTimeIs(time, 14, 10);
        });

        it("should return given maxTime, if given time is after maxTime", () => {
            const timeAfterMaxTime = createTimeObject(15, 40);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeAfterMaxTime, minTime, maxTime);

            assertTimeIs(time, 15, 30);
        });

        it("should return given maxTime, if given time is same as maxTime", () => {
            const timeSameAsMaxTime = createTimeObject(15, 30);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeSameAsMaxTime, minTime, maxTime);

            assertTimeIs(time, 15, 30);
        });

        it("should return given minTime, if given time is before minTime", () => {
            const timeBeforeMinTime = createTimeObject(9, 25);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeBeforeMinTime, minTime, maxTime);

            assertTimeIs(time, 10, 20);
        });

        it("should return given minTime, if given time is same as minTime", () => {
            const timeSameAsMinTime = createTimeObject(10, 20);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeSameAsMinTime, minTime, maxTime);

            assertTimeIs(time, 10, 20);
        });

        it("should return given maxTime, if minTime === maxTime", () => {
            const minTime = createTimeObject(11, 20);
            const maxTime = createTimeObject(11, 20);

            const time = DateUtils.getTimeInRange(createTimeObject(10, 20), minTime, maxTime);

            assertTimeIs(time, 11, 20);
        });
    });

    describe("convert24HourMeridiem", () => {
        it("should return given hour, if hour is PM and toPm", () => {
            expect(DateUtils.convert24HourMeridiem(12, true)).toBe(12);
            expect(DateUtils.convert24HourMeridiem(13, true)).toBe(13);
            expect(DateUtils.convert24HourMeridiem(22, true)).toBe(22);
            expect(DateUtils.convert24HourMeridiem(23, true)).toBe(23);
        });

        it("should return given hour in AM, if hour is PM and not toPm", () => {
            expect(DateUtils.convert24HourMeridiem(12, false)).toBe(0);
            expect(DateUtils.convert24HourMeridiem(13, false)).toBe(1);
            expect(DateUtils.convert24HourMeridiem(22, false)).toBe(10);
            expect(DateUtils.convert24HourMeridiem(23, false)).toBe(11);
        });

        it("should return given hour, if hour is AM and not toPm", () => {
            expect(DateUtils.convert24HourMeridiem(0, false)).toBe(0);
            expect(DateUtils.convert24HourMeridiem(1, false)).toBe(1);
            expect(DateUtils.convert24HourMeridiem(10, false)).toBe(10);
            expect(DateUtils.convert24HourMeridiem(11, false)).toBe(11);
        });

        it("should return given hour in PM, if hour is AM and toPm", () => {
            expect(DateUtils.convert24HourMeridiem(0, true)).toBe(12);
            expect(DateUtils.convert24HourMeridiem(1, true)).toBe(13);
            expect(DateUtils.convert24HourMeridiem(10, true)).toBe(22);
            expect(DateUtils.convert24HourMeridiem(11, true)).toBe(23);
        });

        it("throws an error only for invalid hours", () => {
            expect(() => DateUtils.convert24HourMeridiem(-1, true)).toThrow();
            expect(() => DateUtils.convert24HourMeridiem(24, true)).toThrow();
            expect(() => DateUtils.convert24HourMeridiem(0, true)).not.toThrow();
            expect(() => DateUtils.convert24HourMeridiem(23, true)).not.toThrow();
        });
    });

    describe("getIsPmFrom24Hour", () => {
        it("should return true, if hour (in 24 range) is PM", () => {
            expect(DateUtils.getIsPmFrom24Hour(12)).toBe(true);
            expect(DateUtils.getIsPmFrom24Hour(13)).toBe(true);
            expect(DateUtils.getIsPmFrom24Hour(17)).toBe(true);
            expect(DateUtils.getIsPmFrom24Hour(22)).toBe(true);
            expect(DateUtils.getIsPmFrom24Hour(23)).toBe(true);
        });

        it("should return false, if hour (in 24 range) is AM", () => {
            expect(DateUtils.getIsPmFrom24Hour(0)).toBe(false);
            expect(DateUtils.getIsPmFrom24Hour(1)).toBe(false);
            expect(DateUtils.getIsPmFrom24Hour(5)).toBe(false);
            expect(DateUtils.getIsPmFrom24Hour(10)).toBe(false);
            expect(DateUtils.getIsPmFrom24Hour(11)).toBe(false);
        });

        it("throws an error only for invalid hours", () => {
            expect(() => DateUtils.getIsPmFrom24Hour(-1)).toThrow();
            expect(() => DateUtils.getIsPmFrom24Hour(24)).toThrow();
            expect(() => DateUtils.getIsPmFrom24Hour(0)).not.toThrow();
            expect(() => DateUtils.getIsPmFrom24Hour(23)).not.toThrow();
        });
    });

    describe("get12HourFrom24Hour", () => {
        it("should return correct 12-hour format from 24-hour format", () => {
            expect(DateUtils.get12HourFrom24Hour(0)).toBe(12);
            expect(DateUtils.get12HourFrom24Hour(5)).toBe(5);
            expect(DateUtils.get12HourFrom24Hour(11)).toBe(11);
            expect(DateUtils.get12HourFrom24Hour(12)).toBe(12);
            expect(DateUtils.get12HourFrom24Hour(18)).toBe(6);
            expect(DateUtils.get12HourFrom24Hour(23)).toBe(11);
        });

        it("throws an error only for invalid 24-hours", () => {
            expect(() => DateUtils.get12HourFrom24Hour(-1)).toThrow();
            expect(() => DateUtils.get12HourFrom24Hour(24)).toThrow();
            expect(() => DateUtils.get12HourFrom24Hour(0)).not.toThrow();
            expect(() => DateUtils.get12HourFrom24Hour(23)).not.toThrow();
        });
    });

    describe("get24HourFrom12Hour", () => {
        it("should return correct 24-hour format from 12-hour format, if isPm", () => {
            expect(DateUtils.get24HourFrom12Hour(1, true)).toBe(13);
            expect(DateUtils.get24HourFrom12Hour(7, true)).toBe(19);
            expect(DateUtils.get24HourFrom12Hour(11, true)).toBe(23);
            expect(DateUtils.get24HourFrom12Hour(12, true)).toBe(12);
        });

        it("should return correct 24-hour format from 12-hour format, if not isPm", () => {
            expect(DateUtils.get24HourFrom12Hour(1, false)).toBe(1);
            expect(DateUtils.get24HourFrom12Hour(4, false)).toBe(4);
            expect(DateUtils.get24HourFrom12Hour(11, false)).toBe(11);
            expect(DateUtils.get24HourFrom12Hour(12, false)).toBe(0);
        });

        it("throws an error only for invalid 12-hours", () => {
            expect(() => DateUtils.get24HourFrom12Hour(0, true)).toThrow();
            expect(() => DateUtils.get24HourFrom12Hour(13, true)).toThrow();
            expect(() => DateUtils.get24HourFrom12Hour(1, true)).not.toThrow();
            expect(() => DateUtils.get24HourFrom12Hour(12, true)).not.toThrow();
        });
    });

    describe("getDateTime", () => {
        const DATE = new Date("July 1 1999 4:30");

        it("should return null for null date", () => expect(DateUtils.getDateTime(null)).toBeNull());

        it("should clear time if time arg is omitted", () => {
            assertDateTime(DateUtils.getDateTime(DATE));
        });

        it("should clear time when time arg is null", () => {
            assertDateTime(DateUtils.getDateTime(DATE, null));
        });

        it("should set time if given", () => {
            const time = createTimeObject(12, 12, 12, 12);
            assertDateTime(DateUtils.getDateTime(DATE, time), time);
        });

        function assertDateTime(date: Date | null, time: Date = createTimeObject(0)) {
            expect(date).not.toBeNull();
            expect(date!.toDateString()).toBe(DATE.toDateString());
            expect(date!.toTimeString()).toBe(time.toTimeString());
        }
    });
});
