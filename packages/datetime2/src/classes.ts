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

import { Classes as DatetimeClasses } from "@blueprintjs/datetime";

const RDP_DAY = "rdp-day";
const DATEPICKER_NAV_BUTTON = `${DatetimeClasses.DATEPICKER}-nav-button`;

export const Classes = {
    ...DatetimeClasses,
    // these classes need the "3" suffix because they overlap with DatePicker v1 / react-day-picker v7 classes
    DATEPICKER3_DAY: RDP_DAY,
    DATEPICKER3_DAY_DISABLED: `${RDP_DAY}_disabled`,
    DATEPICKER3_DAY_IS_TODAY: `${RDP_DAY}_today`,
    DATEPICKER3_DAY_OUTSIDE: `${RDP_DAY}_outside`,
    DATEPICKER3_DAY_SELECTED: `${RDP_DAY}_selected`,
    // these classes intentionally left without "3" suffix because they do not overlap with DatePicker v1, and this way we don't need to migrate them later, which reduces code churn
    DATEPICKER_HIGHLIGHT_CURRENT_DAY: `${DatetimeClasses.DATEPICKER}-highlight-current-day`,
    DATEPICKER_NAV_BUTTON,
    DATEPICKER_NAV_BUTTON_NEXT: `${DATEPICKER_NAV_BUTTON}-next`,
    DATEPICKER_NAV_BUTTON_PREVIOUS: `${DATEPICKER_NAV_BUTTON}-previous`,
};
