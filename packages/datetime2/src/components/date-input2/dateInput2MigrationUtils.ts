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
 * Adapter for automated DateInput -> DateInput2 migrations.
 *
 * @param handler DateInput onChange handler
 * @returns DateInput2 onChange handler
 */
export function onChangeAdapter(handler: DateInputProps["onChange"]): DateInput2Props["onChange"] {
    if (handler === undefined) {
        return noOp;
    }
    const tz = getCurrentTimezone();
    return (newDate: string | null, isUserChange: boolean) =>
        handler(getDateObjectFromIsoString(newDate, tz) ?? null, isUserChange);
}

/**
 * Adapter for automated DateInput -> DateInput2 migrations.
 *
 * @param value DateInput value
 * @param timePrecision (optional) DateInput timePrecision
 * @returns DateInput2 value
 */
export function valueAdapter(value: DateInputProps["value"], timePrecision?: TimePrecision): DateInput2Props["value"] {
    if (value == null) {
        return null;
    }

    const tz = getCurrentTimezone();
    const inferredTimePrecision =
        value.getMilliseconds() !== 0
            ? TimePrecision.MILLISECOND
            : value.getSeconds() !== 0
            ? TimePrecision.SECOND
            : value.getMinutes() !== 0
            ? TimePrecision.MINUTE
            : undefined;

    return getIsoEquivalentWithUpdatedTimezone(value, tz, timePrecision ?? inferredTimePrecision);
}

function noOp() {
    // nothing
}
