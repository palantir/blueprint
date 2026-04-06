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

/** @fileoverview test utils for react-day-picker v8 */

import { expect } from "@blueprintjs/test-commons/vitest";

import { DATEPICKER3_DAY, DATEPICKER3_DAY_DISABLED } from "./classes";

export function assertDayDisabled(day: HTMLElement, expectDisabled = true) {
    if (expectDisabled) {
        expect(day).toHaveClass(DATEPICKER3_DAY_DISABLED);
    } else {
        expect(day).not.toHaveClass(DATEPICKER3_DAY_DISABLED);
    }
}

export function assertDayHidden(day: HTMLElement, expectHidden = true) {
    const hasDayClass = day.classList.contains(DATEPICKER3_DAY) || day.querySelector(`.${DATEPICKER3_DAY}`) != null;
    if (expectHidden) {
        expect(hasDayClass).toBe(false);
    } else {
        expect(hasDayClass).toBe(true);
    }
}
