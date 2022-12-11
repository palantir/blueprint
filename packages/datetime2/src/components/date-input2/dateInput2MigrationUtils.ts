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

import { DateInputProps, TimePrecision } from "@blueprintjs/datetime";

import { getCurrentTimezone } from "../../common/getTimezone";
import { getDateObjectFromIsoString, getIsoEquivalentWithUpdatedTimezone } from "../../common/timezoneUtils";
import type { DateInput2Props } from "./dateInput2";

/**
 * `onChange` prop adapter for automated DateInput -> DateInput2 migrations.
 *
 * Note that we exclude `undefined` from the input & output types since we expect the callback to be defined
 * if this adapter is used.
 *
 * @param handler DateInput onChange handler
 * @returns DateInput2 onChange handler
 */
export function onChangeAdapter(
    handler: NonNullable<DateInputProps["onChange"]>,
): NonNullable<DateInput2Props["onChange"]> {
    if (handler === undefined) {
        return noOp;
    }
    const tz = getCurrentTimezone();
    return (newDate: string | null, isUserChange: boolean) =>
        handler(getDateObjectFromIsoString(newDate, tz) ?? null, isUserChange);
}

/**
 * `value` prop adapter for automated DateInput -> DateInput2 migrations.
 *
 * @param value DateInput value
 * @param timePrecision (optional) DateInput timePrecision
 * @returns DateInput2 value
 */
export function valueAdapter(value: DateInputProps["value"], timePrecision?: TimePrecision): DateInput2Props["value"] {
    if (value == null) {
        return null;
    }
    return convertDateToDateString(value, timePrecision);
}

/**
 * Adapter for automated DateInput -> DateInput2 migrations.
 *
 * @param defaultValue DateInput value
 * @param timePrecision (optional) DateInput timePrecision
 * @returns DateInput2 value
 */
export function defaultValueAdapter(
    defaultValue: DateInputProps["defaultValue"],
    timePrecision?: TimePrecision,
): DateInput2Props["defaultValue"] {
    if (defaultValue === undefined) {
        return undefined;
    }
    return convertDateToDateString(defaultValue, timePrecision);
}

function convertDateToDateString(date: Date, timePrecision?: TimePrecision) {
    const tz = getCurrentTimezone();
    const inferredTimePrecision =
        date.getMilliseconds() !== 0
            ? TimePrecision.MILLISECOND
            : date.getSeconds() !== 0
            ? TimePrecision.SECOND
            : date.getMinutes() !== 0
            ? TimePrecision.MINUTE
            : undefined;

    return getIsoEquivalentWithUpdatedTimezone(date, tz, timePrecision ?? inferredTimePrecision);
}

function noOp() {
    // nothing
}
