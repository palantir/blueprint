/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import type { DayModifiers } from "react-day-picker";

export const DISABLED_MODIFIER = "disabled";
export const HOVERED_RANGE_MODIFIER = "hovered-range";
export const OUTSIDE_MODIFIER = "outside";
export const SELECTED_MODIFIER = "selected";
export const SELECTED_RANGE_MODIFIER = "selected-range";
// modifiers the user can't set because they are used by Blueprint or react-day-picker
export const DISALLOWED_MODIFIERS = [
    DISABLED_MODIFIER,
    HOVERED_RANGE_MODIFIER,
    OUTSIDE_MODIFIER,
    SELECTED_MODIFIER,
    SELECTED_RANGE_MODIFIER,
];

export function combineModifiers(baseModifiers: DayModifiers, userModifiers: DayModifiers | undefined): DayModifiers {
    let modifiers = baseModifiers;
    if (userModifiers !== undefined) {
        modifiers = {};
        for (const key of Object.keys(userModifiers)) {
            if (DISALLOWED_MODIFIERS.indexOf(key) === -1) {
                modifiers[key] = userModifiers[key];
            }
        }
        for (const key of Object.keys(baseModifiers)) {
            modifiers[key] = baseModifiers[key];
        }
    }
    return modifiers;
}
