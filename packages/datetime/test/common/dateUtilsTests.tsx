/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";

import { DateRange } from "../../src/";
import * as DateUtils from "../../src/common/dateUtils";
import { Months } from "../../src/common/months";
import { assertTimeIs, createTimeObject } from "./dateTestUtils";

describe("dateUtils", () => {
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
});
