/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type { InputGroupProps, Props } from "@blueprintjs/core";

import type { DateFnsLocaleProps } from "../../common/dateFnsLocaleProps";
import type { DateFormatProps } from "../../common/dateFormatProps";
import type { DatePickerBaseProps } from "../../common/datePickerBaseProps";
import type { DateRange } from "../../common/dateRange";
import type { DatetimePopoverProps } from "../../common/datetimePopoverProps";
import type { ReactDayPickerRangeProps } from "../../common/reactDayPickerProps";
import type { DateRangeShortcut } from "../shortcuts/shortcuts";

export interface DateRangeInputProps
    extends Omit<DatePickerBaseProps, "dayPickerProps" | "locale" | "modifiers">,
        ReactDayPickerRangeProps,
        DateFnsLocaleProps,
        Partial<Omit<DateFormatProps, "locale">>,
        DatetimePopoverProps,
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
     * Whether the calendar popover should close when a date range is fully selected.
     *
     * @default true
     */
    closeOnSelection?: boolean;

    /**
     * Whether displayed months in the calendar are contiguous.
     * If false, each side of the calendar can move independently to non-contiguous months.
     *
     * @default true
     */
    contiguousCalendarMonths?: boolean;

    /**
     * [date-fns format](https://date-fns.org/docs/format) string used to format & parse date strings.
     *
     * Mutually exclusive with the `formatDate` and `parseDate` props.
     *
     * See date-fns [format](https://date-fns.org/docs/format).
     */
    dateFnsFormat?: string;

    /**
     * The default date range to be used in the component when uncontrolled.
     * This will be ignored if `value` is set.
     */
    defaultValue?: DateRange;

    /**
     * Whether the text inputs are non-interactive.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Props to pass to the end-date [input group](#core/components/input-group).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `ref` is not supported; use `inputRef` instead.
     */
    endInputProps?: InputGroupProps;

    /**
     * Called when the user selects a day.
     * If no days are selected, it will pass `[null, null]`.
     * If a start date is selected but not an end date, it will pass `[selectedDate, null]`.
     * If both a start and end date are selected, it will pass `[startDate, endDate]`.
     */
    onChange?: (selectedRange: DateRange) => void;

    /**
     * Called when the user finishes typing in a new date and the date causes an error state.
     * If the date is invalid, `new Date(undefined)` will be returned for the corresponding
     * boundary of the date range.
     * If the date is out of range, the out-of-range date will be returned for the corresponding
     * boundary of the date range (`onChange` is not called in this case).
     */
    onError?: (errorRange: DateRange) => void;

    /**
     * The error message to display when the selected dates overlap.
     * This can only happen when typing dates in the input field.
     *
     * @default "Overlapping dates"
     */
    overlappingDatesMessage?: string;

    /**
     * Whether the entire text field should be selected on focus.
     *
     * @default false
     */
    selectAllOnFocus?: boolean;

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
     * Props to pass to the start-date [input group](#core/components/input-group).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `ref` is not supported; use `inputRef` instead.
     */
    startInputProps?: InputGroupProps;

    /**
     * The currently selected date range.
     * If the prop is strictly `undefined`, the component acts in an uncontrolled manner.
     * If this prop is anything else, the component acts in a controlled manner.
     * To display an empty value in the input fields in a controlled manner, pass `[null, null]`.
     * To display an invalid date error in either input field, pass `new Date(undefined)`
     * for the appropriate date in the value prop.
     */
    value?: DateRange;
}

export type DateRangeInputDefaultProps = Required<
    Pick<
        DateRangeInputProps,
        | "allowSingleDayRange"
        | "closeOnSelection"
        | "contiguousCalendarMonths"
        | "dayPickerProps"
        | "disabled"
        | "endInputProps"
        | "invalidDateMessage"
        | "locale"
        | "maxDate"
        | "minDate"
        | "outOfRangeMessage"
        | "overlappingDatesMessage"
        | "popoverProps"
        | "selectAllOnFocus"
        | "shortcuts"
        | "singleMonthOnly"
        | "startInputProps"
    >
>;

export type DateRangeInputPropsWithDefaults = Omit<DateRangeInputProps, keyof DateRangeInputDefaultProps> &
    DateRangeInputDefaultProps;
