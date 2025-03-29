/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type { InputGroupProps, Props } from "@blueprintjs/core";

import type { DateFnsLocaleProps } from "../../common/dateFnsLocaleProps";
import type { DateFormatProps } from "../../common/dateFormatProps";
import type { DatePickerBaseProps } from "../../common/datePickerBaseProps";
import type { DatetimePopoverProps } from "../../common/datetimePopoverProps";
import type { ReactDayPickerSingleProps } from "../../common/reactDayPickerProps";
import type { DatePickerShortcut } from "../shortcuts/shortcuts";

export interface DateInputProps
    extends Omit<DatePickerBaseProps, "dayPickerProps" | "locale" | "modifiers">,
        ReactDayPickerSingleProps,
        DateFnsLocaleProps,
        Partial<Omit<DateFormatProps, "locale">>,
        DatetimePopoverProps,
        Props {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * Passed to `DatePicker` component.
     *
     * @default true
     */
    canClearSelection?: boolean;

    /**
     * Text for the reset button in the date picker action bar.
     * Passed to `DatePicker` component.
     *
     * @default "Clear"
     */
    clearButtonText?: string;

    /**
     * Whether the calendar popover should close when a date is selected.
     *
     * @default true
     */
    closeOnSelection?: boolean;

    /**
     * [date-fns format](https://date-fns.org/docs/format) string used to format & parse date strings.
     *
     * Mutually exclusive with the `formatDate` and `parseDate` props.
     *
     * See date-fns [format](https://date-fns.org/docs/format).
     */
    dateFnsFormat?: string;

    /**
     * The default timezone selected. Defaults to the user's local timezone.
     *
     * Mutually exclusive with `timezone` prop.
     *
     * @see https://www.iana.org/time-zones
     */
    defaultTimezone?: string;

    /**
     * The default date to be used in the component when uncontrolled, represented as an ISO string.
     */
    defaultValue?: string;

    /**
     * Whether the date input is non-interactive.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether to disable the timezone select.
     *
     * @default false
     */
    disableTimezoneSelect?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Props to pass to the [InputGroup component](#core/components/input-group).
     *
     * Some properties are unavailable:
     * - `inputProps.value`: use `value` instead
     * - `inputProps.disabled`: use `disabled` instead
     * - `inputProps.type`: cannot be customized, always set to "text"
     *
     * Note that `inputProps.tagName` will override `popoverProps.targetTagName`.
     */
    inputProps?: Partial<Omit<InputGroupProps, "disabled" | "type" | "value">>;

    /**
     * Callback invoked whenever the date or timezone has changed.
     *
     * @param newDate ISO string or `null` (if the date is invalid or text input has been cleared)
     * @param isUserChange `true` if the user clicked on a date in the calendar, changed the input value,
     *     or cleared the selection; `false` if the date was changed by changing the month or year.
     */
    onChange?: (newDate: string | null, isUserChange: boolean) => void;

    /**
     * Called when the user finishes typing in a new date and the date causes an error state.
     * If the date is invalid, `new Date(undefined)` will be returned. If the date is out of range,
     * the out of range date will be returned (`onChange` is not called in this case).
     */
    onError?: (errorDate: Date) => void;

    /**
     * Callback invoked when the user selects a timezone.
     *
     * @param timezone the new timezone's IANA code
     */
    onTimezoneChange?: (timezone: string) => void;

    /**
     * Element to render on right side of input.
     */
    rightElement?: React.JSX.Element;

    /**
     * Whether shortcuts to quickly select a date are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     *
     * @default false
     */
    shortcuts?: boolean | DatePickerShortcut[];

    /**
     * Whether the bottom bar displaying "Today" and "Clear" buttons should be shown below the calendar.
     *
     * @default false
     */
    showActionsBar?: boolean;

    /**
     * Whether to show the timezone select dropdown on the right side of the input.
     * If `timePrecision` is undefined, this will always be false.
     *
     * @default false
     */
    showTimezoneSelect?: boolean;

    /**
     * The currently selected timezone UTC identifier, e.g. "Pacific/Honolulu".
     *
     * If you set this prop, the TimezoneSelect will behave in a controlled manner and you are responsible
     * for updating this value using the `onTimezoneChange` callback.
     *
     * Mutually exclusive with `defaultTimezone` prop.
     *
     * See [IANA Time Zones](https://www.iana.org/time-zones).
     */
    timezone?: string;

    /**
     * Text for the today button in the date picker action bar.
     * Passed to `DatePicker` component.
     *
     * @default "Today"
     */
    todayButtonText?: string;

    /** An ISO string representing the selected time. */
    value?: string | null;
}

export type DateInputDefaultProps = Required<
    Pick<
        DateInputProps,
        | "closeOnSelection"
        | "disabled"
        | "invalidDateMessage"
        | "locale"
        | "maxDate"
        | "minDate"
        | "outOfRangeMessage"
        | "reverseMonthAndYearMenus"
    >
>;

export type DateInputPropsWithDefaults = Omit<DateInputProps, keyof DateInputDefaultProps> & DateInputDefaultProps;
