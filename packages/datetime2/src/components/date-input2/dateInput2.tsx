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
import { formatInTimeZone } from "date-fns-tz";
import { isEmpty } from "lodash-es";
import * as React from "react";

import { Tag } from "@blueprintjs/core";
import { DateInput, DateInputProps, TimePrecision } from "@blueprintjs/datetime";

import * as Classes from "../../common/classes";
import { getTimezone } from "../../common/getTimezone";
import { getTimezoneName } from "../../common/timezoneNameUtils";
import { convertDateToLocalEquivalentOfTimezoneTime, convertLocalDateToTimezoneTime } from "../../common/timezoneUtils";
import { TimezonePicker2 } from "../timezone-picker/timezonePicker2";

export interface IDateInput2Props extends Omit<DateInputProps, "onChange" | "value" | "rightElement"> {
    /** The default timezone selected. Defaults to the user local timezone */
    defaultTimezone?: string;
    /** Callback invoked whenever the date or timezone has changed. ISO string */
    onChange: (newDate: string, isUserChange?: boolean) => void;

    /** An ISO string mapping to the selected time. */
    value: string | null;
    /** Whether to completely hide timezone elements,
     * if TimePrecision is undefined, this will always be true
     */
    hideTimezone?: boolean;
    disableTimezoneSelect?: boolean;
}

const NO_TIME_PRECISION = "date";
const UTC_IANA_LABEL = "Etc/UTC";

const TIME_FORMAT_TO_ISO_FORMAT: Record<TimePrecision | "date", string> = {
    [TimePrecision.MILLISECOND]: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
    [TimePrecision.SECOND]: "yyyy-MM-dd'T'HH:mm:ssxxx",
    [TimePrecision.MINUTE]: "yyyy-MM-dd'T'HH:mmxxx",
    [NO_TIME_PRECISION]: "yyyy-MM-dd",
};

const timepickerButtonProps = {
    fill: false,
    minimal: true,
    outlined: true,
};

export const DateInput2: React.FC<IDateInput2Props> = React.memo(function _DateInput2(props) {
    const {
        defaultTimezone,
        value,
        onChange,
        timePrecision,
        disableTimezoneSelect,
        hideTimezone: hideTimezoneProp,
        disabled,
        ...passThroughToDateInputProps
    } = props;

    const [timezoneValue, updateTimezoneValue] = React.useState(defaultTimezone ?? getTimezone());
    const hideTimezone = timePrecision === undefined ? true : hideTimezoneProp;
    const convertedIsoStringToDate = React.useMemo(
        () => getDateObjectFromIsoString(value, timezoneValue),
        [timezoneValue, value],
    );

    const handleTimezoneUpdate = React.useCallback(
        (newTimezone: string) => {
            if (convertedIsoStringToDate != null) {
                onChange?.(getIsoEquivalentWithUpdatedTimezone(convertedIsoStringToDate, newTimezone, timePrecision));
            }
            updateTimezoneValue(newTimezone);
        },
        [onChange, convertedIsoStringToDate, timePrecision],
    );

    const handleChangeDateValue = React.useCallback(
        (newDate: Date | null, isUserChange: boolean) => {
            if (newDate == null) {
                return;
            }
            onChange?.(getIsoEquivalentWithUpdatedTimezone(newDate, timezoneValue, timePrecision), isUserChange);
        },
        [onChange, timezoneValue, timePrecision],
    );

    const guaranteedValidDateValue = React.useMemo(
        () =>
            convertedIsoStringToDate != null && isValid(convertedIsoStringToDate)
                ? convertedIsoStringToDate
                : convertLocalDateToTimezoneTime(new Date(), timezoneValue),
        [timezoneValue, convertedIsoStringToDate],
    );

    const maybeTimezonePicker = hideTimezone ? undefined : (
        <TimezonePicker2
            value={timezoneValue}
            onChange={handleTimezoneUpdate}
            date={guaranteedValidDateValue}
            disabled={disabled || disableTimezoneSelect}
            className={Classes.DATE_INPUT_TIMEZONE_PICKER}
            buttonProps={timepickerButtonProps}
        >
            <Tag rightIcon="caret-down" interactive={true} minimal={true}>
                {getTimezoneName(guaranteedValidDateValue, timezoneValue, false)}
            </Tag>
        </TimezonePicker2>
    );

    return (
        <DateInput
            {...passThroughToDateInputProps}
            value={convertedIsoStringToDate}
            onChange={handleChangeDateValue}
            timePrecision={timePrecision}
            rightElement={maybeTimezonePicker}
            disabled={disabled}
        />
    );
});

function getIsoEquivalentWithUpdatedTimezone(date: Date, timezone: string, timePrecision: TimePrecision | undefined) {
    const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(date, timezone);
    const formattedDateInTimezone = formatInTimeZone(convertedDate, timezone, getTimePrecision(timePrecision));
    return formattedDateInTimezone;
}

const getTimePrecision = (timePrecision: TimePrecision | undefined): string =>
    TIME_FORMAT_TO_ISO_FORMAT[timePrecision ?? NO_TIME_PRECISION];

const getDateObjectFromIsoString = (value: string | null | undefined, timeZone: string) => {
    if (value == null || isEmpty(value)) {
        return null;
    }
    const date = new Date(value);
    // If the value is just a date format then we convert it to midnight in local time to avoid weird things happening
    if (value.length === 10) {
        // If it's just a date, we know it's interpreted as midnight UTC so we convert it to local time of that UTC time
        return convertLocalDateToTimezoneTime(date, UTC_IANA_LABEL);
    }
    return convertLocalDateToTimezoneTime(date, timeZone);
};
