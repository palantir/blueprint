/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { isValid } from "date-fns";
import * as React from "react";

import { ButtonProps, DISPLAYNAME_PREFIX, Tag } from "@blueprintjs/core";
import { DateInput, DateInputProps } from "@blueprintjs/datetime";

import * as Classes from "../../common/classes";
import { getCurrentTimezone } from "../../common/getTimezone";
import { getTimezoneName } from "../../common/timezoneNameUtils";
import {
    convertLocalDateToTimezoneTime,
    getDateObjectFromIsoString,
    getIsoEquivalentWithUpdatedTimezone,
} from "../../common/timezoneUtils";
import { TimezoneSelect } from "../timezone-select/timezoneSelect";

export interface DateInput2Props extends Omit<DateInputProps, "defaultValue" | "onChange" | "value" | "rightElement"> {
    /** The default timezone selected. Defaults to the user local timezone */
    defaultTimezone?: string;

    /**
     * The default date to be used in the component when uncontrolled, represented as an ISO string.
     */
    defaultValue?: string;

    /**
     * Callback invoked whenever the date or timezone has changed.
     *
     * @param newDate ISO string or `null` (if the date is invalid or text input has been cleared)
     * @param isUserChange `true` if the user clicked on a date in the calendar, changed the input value,
     *     or cleared the selection; `false` if the date was changed by changing the month or year.
     */
    onChange?: (newDate: string | null, isUserChange?: boolean) => void;

    /** An ISO string representing the selected time. */
    value?: string | null;

    /**
     * Whether to show the timezone select dropdown on the right side of the input.
     * If `timePrecision` is undefined, this will always be false.
     *
     * @default false
     */
    showTimezoneSelect?: boolean;

    /**
     * Whether to disable the timezone select.
     *
     * @default false
     */
    disableTimezoneSelect?: boolean;
}

const timezoneSelectButtonProps: Partial<ButtonProps> = {
    fill: false,
    minimal: true,
    outlined: true,
};

export const DateInput2: React.FC<DateInput2Props> = React.memo(function _DateInput2(props) {
    const {
        defaultTimezone,
        defaultValue,
        disabled,
        disableTimezoneSelect,
        onChange,
        showTimezoneSelect,
        timePrecision,
        value,
        ...dateInputProps
    } = props;

    const [timezoneValue, setTimezoneValue] = React.useState(defaultTimezone ?? getCurrentTimezone());
    const valueAsDate = React.useMemo(() => getDateObjectFromIsoString(value, timezoneValue), [timezoneValue, value]);
    const defaultValueAsDate = React.useMemo(
        () => getDateObjectFromIsoString(defaultValue, timezoneValue),
        [defaultValue, defaultTimezone],
    );
    // when uncontrolled, we need to keep local state for the date value so that we can send it to the consumer when
    // handling timezone changes
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValueAsDate);

    const handleTimezoneChange = React.useCallback(
        (newTimezone: string) => {
            setTimezoneValue(newTimezone);
            if (valueAsDate === undefined && uncontrolledValue !== undefined) {
                // uncontrolled
                const newDateString = getIsoEquivalentWithUpdatedTimezone(
                    uncontrolledValue,
                    newTimezone,
                    timePrecision,
                );
                onChange?.(newDateString);
            } else if (valueAsDate != null) {
                const newDateString = getIsoEquivalentWithUpdatedTimezone(valueAsDate, newTimezone, timePrecision);
                onChange?.(newDateString);
            }
        },
        [onChange, valueAsDate, timePrecision, uncontrolledValue],
    );

    const handleDateChange = React.useCallback(
        (newDate: Date | null, isUserChange: boolean) => {
            if (newDate == null) {
                onChange?.(newDate, isUserChange);
                return;
            }
            if (valueAsDate === undefined) {
                // uncontrolled
                setUncontrolledValue(newDate);
            }
            const newDateString = getIsoEquivalentWithUpdatedTimezone(newDate, timezoneValue, timePrecision);
            onChange?.(newDateString, isUserChange);
        },
        [onChange, timezoneValue, timePrecision],
    );

    // we need a date which is guaranteed to be non-null here; if necessary, we use today's date and shift
    // it to the desired/current timezone
    const tzSelectDate = React.useMemo(
        () =>
            valueAsDate != null && isValid(valueAsDate)
                ? valueAsDate
                : convertLocalDateToTimezoneTime(new Date(), timezoneValue),
        [timezoneValue, valueAsDate],
    );

    const isTimezoneSelectHidden = timePrecision === undefined || showTimezoneSelect === false;
    const isTimezoneSelectDisabled = disabled || disableTimezoneSelect;

    const maybeTimezonePicker = isTimezoneSelectHidden ? undefined : (
        <TimezoneSelect
            value={timezoneValue}
            onChange={handleTimezoneChange}
            date={tzSelectDate}
            disabled={isTimezoneSelectDisabled}
            className={Classes.DATE_INPUT_TIMEZONE_SELECT}
            buttonProps={timezoneSelectButtonProps}
        >
            <Tag
                rightIcon={isTimezoneSelectDisabled ? undefined : "caret-down"}
                interactive={!isTimezoneSelectDisabled}
                minimal={true}
            >
                {getTimezoneName(tzSelectDate, timezoneValue, false)}
            </Tag>
        </TimezoneSelect>
    );

    return (
        <DateInput
            {...dateInputProps}
            defaultValue={defaultValueAsDate}
            value={valueAsDate}
            onChange={handleDateChange}
            timePrecision={timePrecision}
            rightElement={maybeTimezonePicker}
            disabled={disabled}
        />
    );
});
DateInput2.displayName = `${DISPLAYNAME_PREFIX}.DateInput2`;
