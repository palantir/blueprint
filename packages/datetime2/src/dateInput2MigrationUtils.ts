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

import { type DateInputProps, TimePrecision, TimezoneUtils } from "@blueprintjs/datetime";

type DateInputLegacyValue = Date | null | undefined;
type DateInputLegacyDefaultValue = Date | undefined;
type DateInputLegacyChangeHandler = (selectedDate: Date | null, isUserChange: boolean) => void;

/**
 * `onChange` prop adapter for automated DateInput -> DateInput2 migration in @blueprintjs/datetime2 v0.x.
 *
 * Note that we exclude `undefined` from the input & output types since we expect the callback to be defined
 * if this adapter is used.
 *
 * @param handler DateInput onChange handler
 * @returns DateInput2 onChange handler
 */
export function onChangeAdapter(handler: DateInputLegacyChangeHandler): NonNullable<DateInputProps["onChange"]> {
    if (handler === undefined) {
        return noOp;
    }
    const tz = TimezoneUtils.getCurrentTimezone();
    return (newDate: string | null, isUserChange: boolean) =>
        handler(TimezoneUtils.getDateObjectFromIsoString(newDate, tz) ?? null, isUserChange);
}

/**
 * `value` prop adapter for automated DateInput -> DateInput2 migration in @blueprintjs/datetime2 v0.x.
 *
 * @param value DateInput value
 * @param timePrecision (optional) DateInput timePrecision
 * @returns DateInput2 value
 */
export function valueAdapter(value: DateInputLegacyValue, timePrecision?: TimePrecision): DateInputProps["value"] {
    if (value == null || !isValid(value)) {
        return null;
    }
    return convertDateToDateString(value, timePrecision);
}

/**
 * Adapter for automated DateInput -> DateInput2 migration in @blueprintjs/datetime2 v0.x.
 *
 * @param defaultValue DateInput value
 * @param timePrecision (optional) DateInput timePrecision
 * @returns DateInput2 value
 */
export function defaultValueAdapter(
    defaultValue: DateInputLegacyDefaultValue,
    timePrecision?: TimePrecision,
): DateInputProps["defaultValue"] {
    if (defaultValue === undefined || !isValid(defaultValue)) {
        return undefined;
    }
    return convertDateToDateString(defaultValue, timePrecision);
}

function convertDateToDateString(date: Date, timePrecision?: TimePrecision) {
    const tz = TimezoneUtils.getCurrentTimezone();
    const inferredTimePrecision =
        date.getMilliseconds() !== 0
            ? TimePrecision.MILLISECOND
            : date.getSeconds() !== 0
              ? TimePrecision.SECOND
              : date.getMinutes() !== 0
                ? TimePrecision.MINUTE
                : undefined;

    return TimezoneUtils.getIsoEquivalentWithUpdatedTimezone(date, tz, timePrecision ?? inferredTimePrecision);
}

function noOp() {
    // nothing
}
