
import * as moment from "moment";

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

    /*public static getBoundaryToFocusOnHover(selectedStart: moment.Moment,
                                            selectedEnd: moment.Moment,
                                            hoveredRange: DateRange,
                                            day: Date,
                                            boundaryToModify: DateRangeBoundary,
                                            focusedBoundary: DateRangeBoundary) {
        if (hoveredRange == null) {
            return undefined;
        }

        const [hoveredStart, hoveredEnd] = fromDateRangeToMomentDateRange(hoveredRange);
        const [isHoveredStartDefined, isHoveredEndDefined] = [hoveredStart, hoveredEnd].map((d) => !isMomentNull(d));
        const [isStartDateSelected, isEndDateSelected] = [selectedStart, selectedEnd].map((d) => !isMomentNull(d));

        const isModifyingStartBoundary = boundaryToModify === DateRangeBoundary.START;
        const isModifyingEndBoundary = !isModifyingStartBoundary;

        const hoveredDay = fromDateToMoment(day);

        let boundaryToFocusOnHover: DateRangeBoundary = focusedBoundary;

        if (isStartDateSelected && isEndDateSelected) {
            if (isHoveredStartDefined && isHoveredEndDefined) {
                if (hoveredStart.isSame(selectedStart, "day")) {
                    // we'd be modifying the end date on click
                    boundaryToFocusOnHover = END;
                } else if (hoveredEnd.isSame(selectedEnd, "day")) {
                    // we'd be modifying the start date on click
                    boundaryToFocusOnHover = START;
                }
            } else if (isHoveredStartDefined) {
                if (isModifyingStartBoundary && hoveredDay.isSame(selectedEnd, "day")) {
                    // we'd be deselecting the end date on click
                    boundaryToFocusOnHover = END;
                } else if (isModifyingStartBoundary) {
                    // we'd be specifying a new start date and clearing the end date on click
                    boundaryToFocusOnHover = START;
                } else {
                    // we'd be deselecting the end date on click
                    boundaryToFocusOnHover = END;
                }
            } else if (isHoveredEndDefined) {
                if (isModifyingEndBoundary && hoveredDay.isSame(selectedStart, "day")) {
                    // we'd be deselecting the start date on click
                    boundaryToFocusOnHover = START;
                } else if (isModifyingEndBoundary) {
                    // we'd be specifying a new end date (clearing the start date) on click
                    boundaryToFocusOnHover = END;
                } else {
                    // we'd be deselecting the start date on click
                    boundaryToFocusOnHover = START;
                }
            }
        } else if (isStartDateSelected) {
            if (isHoveredStartDefined && isHoveredEndDefined) {
                if (hoveredStart.isSame(selectedStart, "day")) {
                    // we'd be modifying the end date on click, so focus the end field
                    boundaryToFocusOnHover = END;
                } else if (hoveredEnd.isSame(selectedStart, "day")) {
                    // we'd be modifying the start date on click, so focus the start field
                    boundaryToFocusOnHover = START;
                }
            } else if (isHoveredStartDefined) {
                // we'd be replacing the start date on click
                boundaryToFocusOnHover = START;
            } else if (isHoveredEndDefined) {
                // we'd be converting the selected start date to an end date
                boundaryToFocusOnHover = END;
            } else {
                // we'd be deselecting start date on click
                boundaryToFocusOnHover = START;
            }
        } else if (isEndDateSelected) {
            if (isHoveredStartDefined && isHoveredEndDefined) {
                if (hoveredEnd.isSame(selectedEnd, "day")) {
                    // we'd be modifying the start date on click
                    boundaryToFocusOnHover = START;
                } else if (hoveredStart.isSame(selectedEnd, "day")) {
                    // we'd be modifying the end date on click
                    boundaryToFocusOnHover = END;
                }
            } else if (isHoveredEndDefined) {
                // we'd be replacing the end date on click
                boundaryToFocusOnHover = END;
            } else if (isHoveredStartDefined) {
                // we'd be converting the selected end date to a start date
                boundaryToFocusOnHover = START;
            } else {
                // we'd be deselecting end date on click
                boundaryToFocusOnHover = END;
            }
        }

        return boundaryToFocusOnHover;
    }*/

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
                boundaryToFocusOnHover = otherBoundary;
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
                                               props: Partial<IDateRangePickerProps>) {
        const [start, end] = selectedRange;
        const { allowSingleDayRange } = props;

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
