
import {
    areSameDay,
    DateRange,
    DateRangeBoundary,
    // fromDateRangeToMomentDateRange,
    // fromDateToMoment,
    // isMomentNull,
} from "./common/dateUtils";
import {
    IDateRangePickerProps,
} from "./dateRangePicker";

export type DateRangeSelectionState = {
    boundaryToFocusOnHover?: DateRangeBoundary;
    dateRange: DateRange;
};

export class DateRangeSelectionStrategy {

    public static getNextState(currentRange: DateRange,
                               day: Date,
                               boundaryToModify?: DateRangeBoundary,
                               allowSingleDayRange?: boolean): DateRangeSelectionState {
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
        const [start, end] = currentRange;

        // rename for conciseness
        const boundary = boundaryToModify;
        const otherBoundary = this.getOtherBoundary(boundary);

        const boundaryDate = (boundary === DateRangeBoundary.START) ? start : end;
        const otherBoundaryDate = (boundary === DateRangeBoundary.START) ? end : start;

        let boundaryToFocusOnHover: DateRangeBoundary;
        let dateRange: DateRange;

        if (boundaryDate == null && otherBoundaryDate == null) {
            boundaryToFocusOnHover = boundary;
            dateRange = this.createRangeForBoundary(day, null, boundary);
        } else if (boundaryDate != null && otherBoundaryDate == null) {
            const nextBoundaryDate = areSameDay(boundaryDate, day) ? null : day;
            boundaryToFocusOnHover = boundary;
            dateRange = this.createRangeForBoundary(nextBoundaryDate, null, boundary);
        } else if (boundaryDate == null && otherBoundaryDate != null) {
            if (areSameDay(day, otherBoundaryDate)) {
                const [nextBoundaryDate, nextOtherBoundaryDate] = (allowSingleDayRange)
                    ? [otherBoundaryDate, otherBoundaryDate]
                    : [null, null];
                boundaryToFocusOnHover = allowSingleDayRange ? boundary : otherBoundary;
                dateRange = this.createRangeForBoundary(nextBoundaryDate, nextOtherBoundaryDate, boundary);
            } else if (this.isDateOverlappingOtherBoundary(day, otherBoundaryDate, boundary)) {
                boundaryToFocusOnHover = otherBoundary;
                dateRange = this.createRangeForBoundary(otherBoundaryDate, day, boundary);
            } else {
                boundaryToFocusOnHover = boundary;
                dateRange = this.createRangeForBoundary(day, otherBoundaryDate, boundary);
            }
        } else {
            // both boundaryDate and otherBoundaryDate are already defined
            if (areSameDay(boundaryDate, day)) {
                const isSingleDayRangeSelected = areSameDay(boundaryDate, otherBoundaryDate);
                const nextOtherBoundaryDate = isSingleDayRangeSelected ? null : otherBoundaryDate;
                boundaryToFocusOnHover = boundary;
                dateRange = this.createRangeForBoundary(null, nextOtherBoundaryDate, boundary);
            } else if (areSameDay(day, otherBoundaryDate)) {
                const [nextBoundaryDate, nextOtherBoundaryDate] = (allowSingleDayRange)
                    ? [otherBoundaryDate, otherBoundaryDate]
                    : [boundaryDate, null];
                boundaryToFocusOnHover = allowSingleDayRange ? boundary : otherBoundary;
                dateRange = this.createRangeForBoundary(nextBoundaryDate, nextOtherBoundaryDate, boundary);
            } else if (this.isDateOverlappingOtherBoundary(day, otherBoundaryDate, boundary)) {
                boundaryToFocusOnHover = boundary;
                dateRange = this.createRangeForBoundary(day, null, boundary);
            } else {
                // extend the date range with an earlier boundaryDate date
                boundaryToFocusOnHover = boundary;
                dateRange = this.createRangeForBoundary(day, otherBoundaryDate, boundary);
            }
        }

        return { dateRange, boundaryToFocusOnHover } as DateRangeSelectionState;
    }

    private static getDefaultNextState(selectedRange: DateRange,
                                       day: Date,
                                       allowSingleDayRange: boolean) {
        const [start, end] = selectedRange;

        let dateRange: DateRange;

        if (start == null && end == null) {
            dateRange = [day, null];
        } else if (start != null && end == null) {
            dateRange = this.createRange(day, start, allowSingleDayRange);
        } else if (start == null && end != null) {
            dateRange = this.createRange(day, end, allowSingleDayRange);
        } else {
            const isStart = areSameDay(start, day);
            const isEnd = areSameDay(end, day);
            if (isStart && isEnd) {
                dateRange = [null, null];
            } else if (isStart) {
                dateRange = [null, end];
            } else if (isEnd) {
                dateRange = [start, null];
            } else {
                dateRange = [day, null];
            }
        }

        return { dateRange } as DateRangeSelectionState;
    }

    private static isDateOverlappingOtherBoundary(date: Date, otherBoundaryDate: Date, boundary: DateRangeBoundary) {
        return (boundary === DateRangeBoundary.START)
            ? date > otherBoundaryDate
            : date < otherBoundaryDate;
    }

    private static createRangeForBoundary(boundaryDate: Date, otherBoundaryDate: Date, boundary: DateRangeBoundary) {
        if (boundary === DateRangeBoundary.START) {
            return [boundaryDate, otherBoundaryDate] as DateRange;
        } else if (boundary === DateRangeBoundary.END) {
            return [otherBoundaryDate, boundaryDate] as DateRange;
        } else {
            return this.createRange(boundaryDate, otherBoundaryDate);
        }
    }

    private static createRange(a: Date, b: Date, allowSingleDayRange?: boolean): DateRange {
        // clicking the same date again will clear it
        if (!allowSingleDayRange && areSameDay(a, b)) {
            return [null, null];
        }
        return a < b ? [a, b] : [b, a];
    }

    private static getOtherBoundary(boundary: DateRangeBoundary) {
        if (boundary === DateRangeBoundary.START) {
            return DateRangeBoundary.END;
        } else if (boundary === DateRangeBoundary.END) {
            return DateRangeBoundary.START;
        } else {
            return undefined;
        }
    }
}
