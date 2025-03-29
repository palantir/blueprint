/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type { Props } from "@blueprintjs/core";

import type { DateFnsLocaleProps } from "../../common/dateFnsLocaleProps";
import type { DatePickerBaseProps } from "../../common/datePickerBaseProps";
import type { ReactDayPickerSingleProps } from "../../common/reactDayPickerProps";
import type { DatePickerShortcut } from "../shortcuts/shortcuts";

export interface DatePickerProps
    extends Omit<DatePickerBaseProps, "dayPickerProps" | "locale" | "modifiers">,
        DateFnsLocaleProps,
        ReactDayPickerSingleProps,
        Props {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * If disabled, the "Clear" Button in the Actions Bar will also be disabled.
     *
     * @default true
     */
    canClearSelection?: boolean;

    /**
     * Text for the reset button in the action bar.
     *
     * @default "Clear"
     */
    clearButtonText?: string;

    /**
     * Initial day the calendar will display as selected.
     * This should not be set if `value` is set.
     */
    defaultValue?: Date;

    /**
     * Called when the user selects a day.
     * If being used in an uncontrolled manner, `selectedDate` will be `null` if the user clicks the currently selected
     * day. If being used in a controlled manner, `selectedDate` will contain the day clicked no matter what.
     * `isUserChange` is true if the user selected a day, and false if the date was automatically changed
     * by the user navigating to a new month or year rather than explicitly clicking on a date in the calendar.
     */
    onChange?: (selectedDate: Date | null, isUserChange: boolean) => void;

    /**
     * Called when the `shortcuts` props is enabled and the user changes the shortcut.
     */
    onShortcutChange?: (shortcut: DatePickerShortcut, index: number) => void;

    /**
     * The currently selected shortcut.
     * If this prop is provided, the component acts in a controlled manner.
     */
    selectedShortcutIndex?: number;

    /**
     * Whether shortcuts to quickly select a date are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     */
    shortcuts?: boolean | DatePickerShortcut[];

    /**
     * Whether the bottom bar displaying "Today" and "Clear" buttons should be shown.
     *
     * @default false
     */
    showActionsBar?: boolean;

    /**
     * The currently selected timezone UTC identifier, e.g. "Pacific/Honolulu".
     *
     * This prop is only used to determine what date should be selected when clicking the "Today" button in the actions
     * bar. If this value is omitted, the current date will be set using the user's local timezone.
     *
     * See [IANA Time Zones](https://www.iana.org/time-zones).
     */
    timezone?: string;

    /**
     * Text for the today button in the action bar.
     *
     * @default "Today"
     */
    todayButtonText?: string;

    /**
     * The currently selected day. If this prop is provided, the component acts in a controlled manner.
     */
    value?: Date | null;
}
