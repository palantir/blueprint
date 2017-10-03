/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { areSameDay, DateRange, DateRangeBoundary } from "./common/dateUtils";

export interface IDateRangeSelectionState {
    /**
     * The boundary that would be modified by clicking the provided `day`.
     */
    boundary?: DateRangeBoundary;

    /**
     * The date range that would be selected after clicking the provided `day`.
     */
    dateRange: DateRange;
}

export class DateRangeSelectionStrategy {
    /**
     * Returns the new date-range and the boundary that would be affected if `day` were clicked. The
     * affected boundary may be different from the provided `boundary` in some cases. For example,
     * clicking a particular boundary's selected date will always deselect it regardless of which
     * `boundary` you provide to this function (because it's simply a more intuitive interaction).
     */
    public static getNextState(
        currentRange: DateRange,
        day: Date,
        allowSingleDayRange: boolean,
        boundary?: DateRangeBoundary,
    ): IDateRangeSelectionState {
        if (boundary != null) {
            return this.getNextStateForBoundary(currentRange, day, allowSingleDayRange, boundary);
        } else {
            return this.getDefaultNextState(currentRange, day, allowSingleDayRange);
        }
    }

    private static getNextStateForBoundary(
        currentRange: DateRange,
        day: Date,
        allowSingleDayRange: boolean,
        boundary: DateRangeBoundary,
    ): IDateRangeSelectionState {
        const boundaryDate = this.getBoundaryDate(boundary, currentRange);
        const otherBoundary = this.getOtherBoundary(boundary);
        const otherBoundaryDate = this.getBoundaryDate(otherBoundary, currentRange);

        let nextBoundary: DateRangeBoundary;
        let nextDateRange: DateRange;

        if (boundaryDate == null && otherBoundaryDate == null) {
            nextBoundary = boundary;
            nextDateRange = this.createRangeForBoundary(boundary, day, null);
        } else if (boundaryDate != null && otherBoundaryDate == null) {
            const nextBoundaryDate = areSameDay(boundaryDate, day) ? null : day;
            nextBoundary = boundary;
            nextDateRange = this.createRangeForBoundary(boundary, nextBoundaryDate, null);
        } else if (boundaryDate == null && otherBoundaryDate != null) {
            if (areSameDay(day, otherBoundaryDate)) {
                let nextDate: Date;
                if (allowSingleDayRange) {
                    nextBoundary = boundary;
                    nextDate = otherBoundaryDate;
                } else {
                    nextBoundary = otherBoundary;
                    nextDate = null;
                }
                nextDateRange = this.createRangeForBoundary(boundary, nextDate, nextDate);
            } else if (this.isOverlappingOtherBoundary(boundary, day, otherBoundaryDate)) {
                nextBoundary = otherBoundary;
                nextDateRange = this.createRangeForBoundary(boundary, otherBoundaryDate, day);
            } else {
                nextBoundary = boundary;
                nextDateRange = this.createRangeForBoundary(boundary, day, otherBoundaryDate);
            }
        } else {
            // both boundaryDate and otherBoundaryDate are already defined
            if (areSameDay(boundaryDate, day)) {
                const isSingleDayRangeSelected = areSameDay(boundaryDate, otherBoundaryDate);
                const nextOtherBoundaryDate = isSingleDayRangeSelected ? null : otherBoundaryDate;
                nextBoundary = boundary;
                nextDateRange = this.createRangeForBoundary(boundary, null, nextOtherBoundaryDate);
            } else if (areSameDay(day, otherBoundaryDate)) {
                const [nextBoundaryDate, nextOtherBoundaryDate] = allowSingleDayRange
                    ? [otherBoundaryDate, otherBoundaryDate]
                    : [boundaryDate, null];
                nextBoundary = allowSingleDayRange ? boundary : otherBoundary;
                nextDateRange = this.createRangeForBoundary(boundary, nextBoundaryDate, nextOtherBoundaryDate);
            } else if (this.isOverlappingOtherBoundary(boundary, day, otherBoundaryDate)) {
                nextBoundary = boundary;
                nextDateRange = this.createRangeForBoundary(boundary, day, null);
            } else {
                // extend the date range with an earlier boundaryDate date
                nextBoundary = boundary;
                nextDateRange = this.createRangeForBoundary(boundary, day, otherBoundaryDate);
            }
        }

        return { dateRange: nextDateRange, boundary: nextBoundary };
    }

    private static getDefaultNextState(
        selectedRange: DateRange,
        day: Date,
        allowSingleDayRange: boolean,
    ): IDateRangeSelectionState {
        const [start, end] = selectedRange;

        let nextDateRange: DateRange;

        if (start == null && end == null) {
            nextDateRange = [day, null];
        } else if (start != null && end == null) {
            nextDateRange = this.createRange(day, start, allowSingleDayRange);
        } else if (start == null && end != null) {
            nextDateRange = this.createRange(day, end, allowSingleDayRange);
        } else {
            const isStart = areSameDay(start, day);
            const isEnd = areSameDay(end, day);
            if (isStart && isEnd) {
                nextDateRange = [null, null];
            } else if (isStart) {
                nextDateRange = [null, end];
            } else if (isEnd) {
                nextDateRange = [start, null];
            } else {
                nextDateRange = [day, null];
            }
        }

        return { dateRange: nextDateRange };
    }

    private static getOtherBoundary(boundary: DateRangeBoundary) {
        return boundary === DateRangeBoundary.START ? DateRangeBoundary.END : DateRangeBoundary.START;
    }

    private static getBoundaryDate(boundary: DateRangeBoundary, dateRange: DateRange) {
        return boundary === DateRangeBoundary.START ? dateRange[0] : dateRange[1];
    }

    private static isOverlappingOtherBoundary(
        boundary: DateRangeBoundary,
        boundaryDate: Date,
        otherBoundaryDate: Date,
    ) {
        return boundary === DateRangeBoundary.START
            ? boundaryDate > otherBoundaryDate
            : boundaryDate < otherBoundaryDate;
    }

    private static createRangeForBoundary(boundary: DateRangeBoundary, boundaryDate: Date, otherBoundaryDate: Date) {
        return boundary === DateRangeBoundary.START
            ? [boundaryDate, otherBoundaryDate] as DateRange
            : [otherBoundaryDate, boundaryDate] as DateRange;
    }

    private static createRange(a: Date, b: Date, allowSingleDayRange: boolean): DateRange {
        // clicking the same date again will clear it
        if (!allowSingleDayRange && areSameDay(a, b)) {
            return [null, null];
        }
        return a < b ? [a, b] : [b, a];
    }
}
