/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type { Props } from "@blueprintjs/core";

import type { DatePickerBaseProps } from "../../common";
import type { DatePickerShortcut } from "../shortcuts/shortcuts";

export interface DatePickerProps extends DatePickerBaseProps, Props {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * If disabled, the "Clear" Button in the Actions Bar will also be disabled.
     *
     * @default true
     */
    canClearSelection?: boolean;

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
    onChange?: (selectedDate: Date, isUserChange: boolean) => void;

    /**
     * Called when the `shortcuts` props is enabled and the user changes the shortcut.
     */
    onShortcutChange?: (shortcut: DatePickerShortcut, index: number) => void;

    /**
     * Whether the bottom bar displaying "Today" and "Clear" buttons should be shown.
     *
     * @default false
     */
    showActionsBar?: boolean;

    /**
     * Whether shortcuts to quickly select a date are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     */
    shortcuts?: boolean | DatePickerShortcut[];

    /**
     * The currently selected shortcut.
     * If this prop is provided, the component acts in a controlled manner.
     */
    selectedShortcutIndex?: number;

    /**
     * Text for the today button in the action bar.
     *
     * @default "Today"
     */
    todayButtonText?: string;

    /**
     * Text for the reset button in the action bar.
     *
     * @default "Clear"
     */
    clearButtonText?: string;

    /**
     * The currently selected day. If this prop is provided, the component acts in a controlled manner.
     */
    value?: Date | null;
}
