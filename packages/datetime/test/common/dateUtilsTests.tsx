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

import { expect } from "chai";

import { DateRange } from "../../src/";
import * as DateUtils from "../../src/common/dateUtils";
import { Months } from "../../src/common/months";
import { assertTimeIs, createTimeObject } from "./dateTestUtils";

describe("DateUtils", () => {
    describe("areRangesEqual", () => {
        const DATE_1 = new Date(2017, Months.JANUARY, 1);
        const DATE_2 = new Date(2017, Months.JANUARY, 2);
        const DATE_3 = new Date(2017, Months.JANUARY, 3);
        const DATE_4 = new Date(2017, Months.JANUARY, 4);

        describe("returns true for", () => {
            runTest("null and null", null, null, true);
            runTest("[null, null] and [null, null]", [null, null], [null, null], true);
            runTest("[DATE_1, DATE_2] and [DATE_1, DATE_2]", [DATE_1, DATE_2], [DATE_1, DATE_2], true);
        });

        describe("returns false for", () => {
            runTest("null and [null, null]", null, [null, null], false);
            runTest("[DATE_1, null] and [DATE_2, null]", [DATE_1, null], [DATE_2, null], false);
            runTest("[DATE_1, null] and [null, null]", [DATE_1, null], [null, null], false);
            runTest("[DATE_1, DATE_2] and [DATE_1, DATE_4]", [DATE_1, DATE_2], [DATE_1, DATE_4], false);
            runTest("[DATE_1, DATE_4] and [DATE_2, DATE_4]", [DATE_1, DATE_4], [DATE_2, DATE_4], false);
            runTest("[DATE_1, DATE_2] and [DATE_3, DATE_4]", [DATE_1, DATE_2], [DATE_3, DATE_4], false);
        });

        function runTest(description: string, dateRange1: DateRange, dateRange2: DateRange, expectedResult: boolean) {
            it(description, () => {
                expect(DateUtils.areRangesEqual(dateRange1, dateRange2)).to.equal(expectedResult);
            });
        }
    });

    it("getDateOnlyWithTime returns Date object with constant year, month, and day", () => {
        const time = DateUtils.getDateOnlyWithTime(createTimeObject(14, 10, 10, 600));

        expect(time.getFullYear()).to.equal(1899);
        expect(time.getMonth()).to.equal(11);
        expect(time.getDay()).to.equal(0);

        expect(time.getHours()).to.equal(14);
        expect(time.getMinutes()).to.equal(10);
        expect(time.getSeconds()).to.equal(10);
        expect(time.getMilliseconds()).to.equal(600);
    });

    describe("isTimeSameOrAfter", () => {
        it("returns true if given time is greater than another time", () => {
            const time = createTimeObject(14, 22, 30, 600);
            const time2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(time, time2)).to.be.true;
        });

        it("returns true if given time is equal to another time", () => {
            const time = createTimeObject(14, 20, 30, 600);
            const time2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(time, time2)).to.be.true;
        });

        it("returns false if given time is smaller than another time", () => {
            const time = createTimeObject(14, 10, 50, 900);
            const time2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(time, time2)).to.be.false;
        });
    });

    describe("isTimeEqualOrGreaterThan", () => {
        it("returns true if time is greater then another time", () => {
            const time = createTimeObject(14, 20);
            const time2 = createTimeObject(14, 10);

            expect(DateUtils.isTimeEqualOrGreaterThan(time, time2)).to.be.true;
        });

        it("returns true if time is equal to another time", () => {
            const time = createTimeObject(14, 10);
            const time2 = createTimeObject(14, 10);

            expect(DateUtils.isTimeEqualOrGreaterThan(time, time2)).to.be.true;
        });

        it("returns false if time is smaller then another time", () => {
            const time = createTimeObject(12, 10);
            const time2 = createTimeObject(13, 10);

            expect(DateUtils.isTimeEqualOrGreaterThan(time, time2)).to.be.false;
        });
    });

    describe("isTimeEqualOrSmallerThan", () => {
        it("returns true if time is smaller then another time", () => {
            const time = createTimeObject(10, 10);
            const time2 = createTimeObject(14, 10);

            expect(DateUtils.isTimeEqualOrSmallerThan(time, time2)).to.be.true;
        });

        it("returns true if time is equal to another time", () => {
            const time = createTimeObject(14, 10);
            const time2 = createTimeObject(14, 10);

            expect(DateUtils.isTimeEqualOrSmallerThan(time, time2)).to.be.true;
        });

        it("returns false if time is greater then another time", () => {
            const time = createTimeObject(14, 10);
            const time2 = createTimeObject(13, 10);

            expect(DateUtils.isTimeEqualOrSmallerThan(time, time2)).to.be.false;
        });
    });

    describe("isTimeInRange", () => {
        // Note that year, month, and day are always ignored
        const minTime = createTimeObject(14, 20, 30, 600);
        const maxTime = createTimeObject(18, 40, 10, 200);

        it("returns true if given time is in range", () => {
            const time = createTimeObject(17, 0, 0, 0);
            expect(DateUtils.isTimeInRange(time, minTime, maxTime)).to.be.true;
        });

        it("returns true if given time is in range, and minTime > maxTime", () => {
            const minTimeBeforeMidnight = createTimeObject(22, 0, 0, 0);
            const maxTimeAfterMidnight = createTimeObject(2, 0, 0, 0);

            const timeAfterMidnight = createTimeObject(1, 0, 0, 0);
            expect(DateUtils.isTimeInRange(timeAfterMidnight, minTimeBeforeMidnight, maxTimeAfterMidnight)).to.be.true;

            const timeBeforeMidnight = createTimeObject(23, 0, 0, 0);
            expect(DateUtils.isTimeInRange(timeBeforeMidnight, minTimeBeforeMidnight, maxTimeAfterMidnight)).to.be.true;
        });

        it("returns false if given time is not in range, and minTime > maxTime", () => {
            const minTimeBeforeMidnight = createTimeObject(22, 0, 0, 0);
            const maxTimeAfterMidnight = createTimeObject(2, 0, 0, 0);

            const time = createTimeObject(16, 0, 0, 0);
            expect(DateUtils.isTimeInRange(time, minTimeBeforeMidnight, maxTimeAfterMidnight)).to.be.false;
        });

        it("returns false if given time is smaller than minTime", () => {
            const time = createTimeObject(13, 10, 50, 900);
            expect(DateUtils.isTimeInRange(time, minTime, maxTime)).to.be.false;
        });

        it("returns false if given time is greater than maxTime", () => {
            const time = createTimeObject(18, 41, 9, 50);
            expect(DateUtils.isTimeInRange(time, minTime, maxTime)).to.be.false;
        });
    });

    describe("getTimeInRange", () => {
        it("returns given time, if it's between minTime and MaxTime", () => {
            const timeInRange = createTimeObject(14, 10);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeInRange, minTime, maxTime);
            assertTimeIs(time, 14, 10);
        });

        it("returns given maxTime, if given time is after maxTime", () => {
            const timeAfterMaxTime = createTimeObject(15, 40);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeAfterMaxTime, minTime, maxTime);

            assertTimeIs(time, 15, 30);
        });

        it("returns given maxTime, if given time is same as maxTime", () => {
            const timeSameAsMaxTime = createTimeObject(15, 30);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeSameAsMaxTime, minTime, maxTime);

            assertTimeIs(time, 15, 30);
        });

        it("returns given minTime, if given time is before minTime", () => {
            const timeBeforeMinTime = createTimeObject(9, 25);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeBeforeMinTime, minTime, maxTime);

            assertTimeIs(time, 10, 20);
        });

        it("returns given minTime, if given time is same as minTime", () => {
            const timeSameAsMinTime = createTimeObject(10, 20);
            const minTime = createTimeObject(10, 20);
            const maxTime = createTimeObject(15, 30);

            const time = DateUtils.getTimeInRange(timeSameAsMinTime, minTime, maxTime);

            assertTimeIs(time, 10, 20);
        });

        it("returns given maxTime, if minTime === maxTime", () => {
            const minTime = createTimeObject(11, 20);
            const maxTime = createTimeObject(11, 20);

            const time = DateUtils.getTimeInRange(createTimeObject(10, 20), minTime, maxTime);

            assertTimeIs(time, 11, 20);
        });
    });

    describe("convert24HourMeridiem", () => {
        it("returns given hour, if hour is PM and toPm", () => {
            expect(DateUtils.convert24HourMeridiem(12, true)).to.equal(12);
            expect(DateUtils.convert24HourMeridiem(13, true)).to.equal(13);
            expect(DateUtils.convert24HourMeridiem(22, true)).to.equal(22);
            expect(DateUtils.convert24HourMeridiem(23, true)).to.equal(23);
        });

        it("returns given hour in AM, if hour is PM and not toPm", () => {
            expect(DateUtils.convert24HourMeridiem(12, false)).to.equal(0);
            expect(DateUtils.convert24HourMeridiem(13, false)).to.equal(1);
            expect(DateUtils.convert24HourMeridiem(22, false)).to.equal(10);
            expect(DateUtils.convert24HourMeridiem(23, false)).to.equal(11);
        });

        it("returns given hour, if hour is AM and not toPm", () => {
            expect(DateUtils.convert24HourMeridiem(0, false)).to.equal(0);
            expect(DateUtils.convert24HourMeridiem(1, false)).to.equal(1);
            expect(DateUtils.convert24HourMeridiem(10, false)).to.equal(10);
            expect(DateUtils.convert24HourMeridiem(11, false)).to.equal(11);
        });

        it("returns given hour in PM, if hour is AM and toPm", () => {
            expect(DateUtils.convert24HourMeridiem(0, true)).to.equal(12);
            expect(DateUtils.convert24HourMeridiem(1, true)).to.equal(13);
            expect(DateUtils.convert24HourMeridiem(10, true)).to.equal(22);
            expect(DateUtils.convert24HourMeridiem(11, true)).to.equal(23);
        });

        it("throws an error only for invalid hours", () => {
            expect(() => DateUtils.convert24HourMeridiem(-1, true)).to.throw();
            expect(() => DateUtils.convert24HourMeridiem(24, true)).to.throw();
            expect(() => DateUtils.convert24HourMeridiem(0, true)).to.not.throw();
            expect(() => DateUtils.convert24HourMeridiem(23, true)).to.not.throw();
        });
    });

    describe("getIsPmFrom24Hour", () => {
        it("returns true, if hour (in 24 range) is PM", () => {
            expect(DateUtils.getIsPmFrom24Hour(12)).to.equal(true);
            expect(DateUtils.getIsPmFrom24Hour(13)).to.equal(true);
            expect(DateUtils.getIsPmFrom24Hour(17)).to.equal(true);
            expect(DateUtils.getIsPmFrom24Hour(22)).to.equal(true);
            expect(DateUtils.getIsPmFrom24Hour(23)).to.equal(true);
        });

        it("returns false, if hour (in 24 range) is AM", () => {
            expect(DateUtils.getIsPmFrom24Hour(0)).to.equal(false);
            expect(DateUtils.getIsPmFrom24Hour(1)).to.equal(false);
            expect(DateUtils.getIsPmFrom24Hour(5)).to.equal(false);
            expect(DateUtils.getIsPmFrom24Hour(10)).to.equal(false);
            expect(DateUtils.getIsPmFrom24Hour(11)).to.equal(false);
        });

        it("throws an error only for invalid hours", () => {
            expect(() => DateUtils.getIsPmFrom24Hour(-1)).to.throw();
            expect(() => DateUtils.getIsPmFrom24Hour(24)).to.throw();
            expect(() => DateUtils.getIsPmFrom24Hour(0)).to.not.throw();
            expect(() => DateUtils.getIsPmFrom24Hour(23)).to.not.throw();
        });
    });

    describe("get12HourFrom24Hour", () => {
        it("returns correct 12-hour format from 24-hour format", () => {
            expect(DateUtils.get12HourFrom24Hour(0)).to.equal(12);
            expect(DateUtils.get12HourFrom24Hour(5)).to.equal(5);
            expect(DateUtils.get12HourFrom24Hour(11)).to.equal(11);
            expect(DateUtils.get12HourFrom24Hour(12)).to.equal(12);
            expect(DateUtils.get12HourFrom24Hour(18)).to.equal(6);
            expect(DateUtils.get12HourFrom24Hour(23)).to.equal(11);
        });

        it("throws an error only for invalid 24-hours", () => {
            expect(() => DateUtils.get12HourFrom24Hour(-1)).to.throw();
            expect(() => DateUtils.get12HourFrom24Hour(24)).to.throw();
            expect(() => DateUtils.get12HourFrom24Hour(0)).to.not.throw();
            expect(() => DateUtils.get12HourFrom24Hour(23)).to.not.throw();
        });
    });

    describe("get24HourFrom12Hour", () => {
        it("returns correct 24-hour format from 12-hour format, if isPm", () => {
            expect(DateUtils.get24HourFrom12Hour(1, true)).to.equal(13);
            expect(DateUtils.get24HourFrom12Hour(7, true)).to.equal(19);
            expect(DateUtils.get24HourFrom12Hour(11, true)).to.equal(23);
            expect(DateUtils.get24HourFrom12Hour(12, true)).to.equal(12);
        });

        it("returns correct 24-hour format from 12-hour format, if not isPm", () => {
            expect(DateUtils.get24HourFrom12Hour(1, false)).to.equal(1);
            expect(DateUtils.get24HourFrom12Hour(4, false)).to.equal(4);
            expect(DateUtils.get24HourFrom12Hour(11, false)).to.equal(11);
            expect(DateUtils.get24HourFrom12Hour(12, false)).to.equal(0);
        });

        it("throws an error only for invalid 12-hours", () => {
            expect(() => DateUtils.get24HourFrom12Hour(0, true)).to.throw();
            expect(() => DateUtils.get24HourFrom12Hour(13, true)).to.throw();
            expect(() => DateUtils.get24HourFrom12Hour(1, true)).to.not.throw();
            expect(() => DateUtils.get24HourFrom12Hour(12, true)).to.not.throw();
        });
    });

    describe("getDateTime", () => {
        const DATE = new Date("July 1 1999 4:30");

        it("null date returns null", () => expect(DateUtils.getDateTime(null)).to.be.null);

        it("clears time if time arg omitted", () => {
            assertDateTime(DateUtils.getDateTime(DATE));
        });

        it("null time arg clears time", () => {
            assertDateTime(DateUtils.getDateTime(DATE, null));
        });

        it("sets time if given", () => {
            const time = createTimeObject(12, 12, 12, 12);
            assertDateTime(DateUtils.getDateTime(DATE, time), time);
        });

        function assertDateTime(date: Date, time: Date = createTimeObject(0)) {
            expect(date.toDateString()).to.equal(DATE.toDateString(), "date not preserved");
            expect(date.toTimeString()).to.equal(time.toTimeString());
        }
    });
});
