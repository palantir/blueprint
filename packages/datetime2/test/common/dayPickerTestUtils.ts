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

import { assert } from "chai";
import type { ReactWrapper } from "enzyme";

import { Classes } from "../../src/classes";

const isDayHidden = (day: ReactWrapper<any, any>): boolean => !day.find(`.${Classes.DATEPICKER3_DAY}`).exists();

export function assertDayDisabled(day: ReactWrapper<any, any>, expectDisabled: boolean = true) {
    assert.equal(day.hasClass(Classes.DATEPICKER3_DAY_DISABLED), expectDisabled);
}

export function assertDayHidden(day: ReactWrapper<any, any>, expectHidden: boolean = true) {
    assert.equal(isDayHidden(day), expectHidden);
}
