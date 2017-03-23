
import {
    areSameDay,
    DateRange,
    DateRangeBoundary,
} from "./common/dateUtils";

export interface IDateRangeSelectionState {
    /**
     * The boundary that would be modified by clicking the provided `day`.
     * May be different from `boundaryToModify` in some special cases
     * (e.g. when hovering over the other boundary's selected date).
     */
    boundary?: DateRangeBoundary;

    /**
     * The date range that would be selected after clicking the provided `day`.
     */
    dateRange: DateRange;
};

export class DateRangeSelectionStrategy {
    public static getNextState(currentRange: DateRange,
                               day: Date,
                               boundaryToModify?: DateRangeBoundary,
                               allowSingleDayRange?: boolean) {
        if (boundaryToModify != null) {
            return this.getNextStateForBoundary(currentRange, day, boundaryToModify, allowSingleDayRange);
        } else {
            return this.getDefaultNextState(currentRange, day, allowSingleDayRange);
        }
    }

    private static getNextStateForBoundary(currentRange: DateRange,
                                           day: Date,
                                           boundaryToModify: DateRangeBoundary,
                                           allowSingleDayRange: boolean) {
        const boundary = boundaryToModify;
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
                const [nextBoundaryDate, nextOtherBoundaryDate] = (allowSingleDayRange)
                    ? [otherBoundaryDate, otherBoundaryDate]
                    : [null, null];
                nextBoundary = allowSingleDayRange ? boundary : otherBoundary;
                nextDateRange = this.createRangeForBoundary(boundary, nextBoundaryDate, nextOtherBoundaryDate);
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
                const [nextBoundaryDate, nextOtherBoundaryDate] = (allowSingleDayRange)
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

        return { dateRange: nextDateRange, boundary: nextBoundary } as IDateRangeSelectionState;
    }

    private static getDefaultNextState(selectedRange: DateRange, day: Date, allowSingleDayRange: boolean) {
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

        return { dateRange: nextDateRange } as IDateRangeSelectionState;
    }

    private static getOtherBoundary(boundary: DateRangeBoundary) {
        return (boundary === DateRangeBoundary.START)
            ? DateRangeBoundary.END
            : DateRangeBoundary.START;
    }

    private static getBoundaryDate(boundary: DateRangeBoundary, dateRange: DateRange) {
        return (boundary === DateRangeBoundary.START)
            ? dateRange[0]
            : dateRange[1];
    }

    private static isOverlappingOtherBoundary(boundary: DateRangeBoundary,
                                              boundaryDate: Date,
                                              otherBoundaryDate: Date) {
        return (boundary === DateRangeBoundary.START)
            ? boundaryDate > otherBoundaryDate
            : boundaryDate < otherBoundaryDate;
    }

    private static createRangeForBoundary(boundary: DateRangeBoundary, boundaryDate: Date, otherBoundaryDate: Date) {
        return (boundary === DateRangeBoundary.START)
            ? [boundaryDate, otherBoundaryDate] as DateRange
            : [otherBoundaryDate, boundaryDate] as DateRange;
    }

    private static createRange(a: Date, b: Date, allowSingleDayRange?: boolean): DateRange {
        // clicking the same date again will clear it
        if (!allowSingleDayRange && areSameDay(a, b)) {
            return [null, null];
        }
        return a < b ? [a, b] : [b, a];
    }
}
