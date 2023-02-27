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

import { Boundary } from "@blueprintjs/core";

import type { DateRange } from "./common/dateRange";
import { areSameDay, setTime } from "./common/dateUtils";
import type { DateRangePickerProps } from "./dateRangePickerProps";
import type { DateRangePickerState } from "./dateRangePickerState";

export interface DateRangeSelectionState {
    /**
     * The boundary that would be modified by clicking the provided `day`.
     */
    boundary?: Boundary;

    /**
     * The date range that would be selected after clicking the provided `day`.
     */
    dateRange: DateRange;
}

/**
 * Selection strategy used to update the picker UI while selecting date ranges.
 *
 * Note that this does not affect the data sent to the `onChange` selection handler; for that logic,
 * see `getStateChange` in `dateRangePicker.tsx` instead.
 */
/* eslint-disable-next-line @typescript-eslint/no-extraneous-class */
export class DateRangeSelectionStrategy {
    /**
     * Returns the new date-range and the boundary that would be affected if `day` were clicked. The
     * affected boundary may be different from the provided `boundary` in some cases. For example,
     * clicking a particular boundary's selected date will always deselect it regardless of which
     * `boundary` you provide to this function (because it's simply a more intuitive interaction).
     */
    public static getNextState(
        props: DateRangePickerProps,
        { value: currentRange, time: currentTimeRange }: DateRangePickerState,
        day: Date,
    ): DateRangeSelectionState {
        const timeValue =
            (props.boundaryToModify === Boundary.START ? currentTimeRange[0] : currentTimeRange[1]) ??
            props.timePickerProps.defaultValue;

        if (timeValue != null) {
            setTime(day, timeValue);
        }

        if (props.boundaryToModify != null) {
            return this.getNextStateForBoundary(props, currentRange, day);
        } else {
            return this.getDefaultNextState(props, currentRange, day);
        }
    }

    /**
     * @param currentRange the currently selected date range
     * @param day the date in the calendar which the user clicked
     */
    private static getNextStateForBoundary(
        { allowSingleDayRange, boundaryToModify: boundary }: DateRangePickerProps,
        currentRange: DateRange,
        day: Date,
    ): DateRangeSelectionState {
        const boundaryDate = this.getBoundaryDate(boundary, currentRange);
        const otherBoundary = this.getOtherBoundary(boundary);
        const otherBoundaryDate = this.getBoundaryDate(otherBoundary, currentRange);

        let nextBoundary: Boundary;
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

    /**
     * @param selectedRange the currently selected date range
     * @param day the date in the calendar which the user clicked
     */
    private static getDefaultNextState(
        { allowSingleDayRange }: DateRangePickerProps,
        selectedRange: DateRange,
        day: Date,
    ): DateRangeSelectionState {
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

    private static getOtherBoundary(boundary: Boundary) {
        return boundary === Boundary.START ? Boundary.END : Boundary.START;
    }

    private static getBoundaryDate(boundary: Boundary, dateRange: DateRange) {
        return boundary === Boundary.START ? dateRange[0] : dateRange[1];
    }

    private static isOverlappingOtherBoundary(boundary: Boundary, boundaryDate: Date, otherBoundaryDate: Date) {
        return boundary === Boundary.START ? boundaryDate > otherBoundaryDate : boundaryDate < otherBoundaryDate;
    }

    private static createRangeForBoundary(boundary: Boundary, boundaryDate: Date, otherBoundaryDate: Date) {
        return boundary === Boundary.START
            ? ([boundaryDate, otherBoundaryDate] as DateRange)
            : ([otherBoundaryDate, boundaryDate] as DateRange);
    }

    private static createRange(a: Date, b: Date, allowSingleDayRange: boolean): DateRange {
        // clicking the same date again will clear it
        if (!allowSingleDayRange && areSameDay(a, b)) {
            return [null, null];
        }
        return a < b ? [a, b] : [b, a];
    }
}
