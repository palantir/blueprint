/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import { DateRange } from "../../src/";
import * as DateUtils from "../../src/common/dateUtils";
import { Months } from "../../src/common/months";
import { createTimeObject } from "./dateTestUtils";

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
        const date = createTimeObject(14, 10, 10, 600);

        const time = DateUtils.getDateOnlyWithTime(date);

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
            const date = createTimeObject(14, 22, 30, 600);
            const date2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(date, date2)).to.be.true;
        });

        it("returns true if given time is equal to another time", () => {
            const date = createTimeObject(14, 20, 30, 600);
            const date2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(date, date2)).to.be.true;
        });

        it("returns false if given time is smaller than another time", () => {
            const date = createTimeObject(14, 10, 50, 900);
            const date2 = createTimeObject(14, 20, 30, 600);

            expect(DateUtils.isTimeSameOrAfter(date, date2)).to.be.false;
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
});
