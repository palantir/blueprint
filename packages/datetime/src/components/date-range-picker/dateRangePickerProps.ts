/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type { Boundary, Props } from "@blueprintjs/core";

import type { DateFnsLocaleProps } from "../../common/dateFnsLocaleProps";
import type { DatePickerBaseProps } from "../../common/datePickerBaseProps";
import type { DateRange } from "../../common/dateRange";
import type { ReactDayPickerRangeProps } from "../../common/reactDayPickerProps";
import type { DateRangeShortcut } from "../shortcuts/shortcuts";

export interface DateRangePickerProps
    extends Omit<DatePickerBaseProps, "dayPickerProps" | "locale" | "modifiers">,
        DateFnsLocaleProps,
        ReactDayPickerRangeProps,
        Props {
    /**
     * Whether the start and end dates of the range can be the same day.
     * If `true`, clicking a selected date will create a one-day range.
     * If `false`, clicking a selected date will clear the selection.
     *
     * @default false
     */
    allowSingleDayRange?: boolean;

    /**
     * The date-range boundary that the next click should modify.
     * This will be honored unless the next click would overlap the other boundary date.
     * In that case, the two boundary dates will be auto-swapped to keep them in chronological order.
     * If `undefined`, the picker will revert to its default selection behavior.
     */
    boundaryToModify?: Boundary;

    /**
     * Whether displayed months in the calendar are contiguous.
     * If false, each side of the calendar can move independently to non-contiguous months.
     *
     * @default true
     */
    contiguousCalendarMonths?: boolean;

    /**
     * Initial `DateRange` the calendar will display as selected.
     * This should not be set if `value` is set.
     */
    defaultValue?: DateRange;

    /**
     * Called when the user selects a day.
     * If no days are selected, it will pass `[null, null]`.
     * If a start date is selected but not an end date, it will pass `[selectedDate, null]`.
     * If both a start and end date are selected, it will pass `[startDate, endDate]`.
     */
    onChange?: (selectedDates: DateRange) => void;

    /**
     * Called when the user changes the hovered date range, either from mouseenter or mouseleave.
     * When triggered from mouseenter, it will pass the date range that would result from next click.
     * When triggered from mouseleave, it will pass `undefined`.
     */
    onHoverChange?: (
        hoveredDates: DateRange | undefined,
        hoveredDay: Date,
        hoveredBoundary: Boundary | undefined,
    ) => void;

    /**
     * Called when the `shortcuts` props is enabled and the user changes the shortcut.
     */
    onShortcutChange?: (shortcut: DateRangeShortcut, index: number) => void;

    /**
     * The currently selected shortcut.
     * If this prop is provided, the component acts in a controlled manner.
     */
    selectedShortcutIndex?: number;

    /**
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     *
     * @default true
     */
    shortcuts?: boolean | DateRangeShortcut[];

    /**
     * Whether to show only a single month calendar.
     *
     * @default false
     */
    singleMonthOnly?: boolean;

    /**
     * The currently selected `DateRange`.
     * If this prop is provided, the component acts in a controlled manner.
     */
    value?: DateRange;
}

export type DateRangePickerDefaultProps = Required<
    Pick<
        DateRangePickerProps,
        | "allowSingleDayRange"
        | "contiguousCalendarMonths"
        | "dayPickerProps"
        | "locale"
        | "maxDate"
        | "minDate"
        | "reverseMonthAndYearMenus"
        | "shortcuts"
        | "singleMonthOnly"
        | "timePickerProps"
    >
>;

export type DateRangePickerPropsWithDefaults = Omit<DateRangePickerProps, keyof DateRangePickerDefaultProps> &
    DateRangePickerDefaultProps;
