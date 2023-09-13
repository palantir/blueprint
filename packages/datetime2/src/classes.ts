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

import classNames from "classnames";
import type { StyledElement } from "react-day-picker";

import { Classes as CoreClasses } from "@blueprintjs/core";
import { Classes as DatetimeClasses } from "@blueprintjs/datetime";

const RDP = "rdp";
const RDP_DAY = `${RDP}-day`;
const DATEPICKER_NAV_BUTTON = `${DatetimeClasses.DATEPICKER}-nav-button`;

const ReactDayPickerClasses = {
    RDP,
    RDP_DAY,
};

const DatePicker3Classes = {
    // these classes need the "3" suffix because they overlap with DatePicker v1 / react-day-picker v7 classes
    DATEPICKER3_DAY: RDP_DAY,
    DATEPICKER3_DAY_DISABLED: `${RDP_DAY}_disabled`,
    DATEPICKER3_DAY_IS_TODAY: `${RDP_DAY}_today`,
    DATEPICKER3_DAY_OUTSIDE: `${RDP_DAY}_outside`,
    DATEPICKER3_DAY_SELECTED: `${RDP_DAY}_selected`,
    // these classes intentionally left without "3" suffix because they do not overlap with DatePicker v1, and this way we don't need to migrate them later, which reduces code churn
    DATEPICKER_DROPDOWN_CONTAINER: `${DatetimeClasses.DATEPICKER}-dropdown-container`,
    DATEPICKER_DROPDOWN_MONTH: `${RDP}-dropdown_month`,
    DATEPICKER_DROPDOWN_YEAR: `${RDP}-dropdown_year`,
    DATEPICKER_HIGHLIGHT_CURRENT_DAY: `${DatetimeClasses.DATEPICKER}-highlight-current-day`,
    DATEPICKER_NAV_BUTTON,
    DATEPICKER_NAV_BUTTON_HIDDEN: `${DATEPICKER_NAV_BUTTON}-hidden`,
    DATEPICKER_NAV_BUTTON_NEXT: `${DATEPICKER_NAV_BUTTON}-next`,
    DATEPICKER_NAV_BUTTON_PREVIOUS: `${DATEPICKER_NAV_BUTTON}-previous`,
};

const DateRangePicker3Classes = {
    DATERANGEPICKER3_DAY_HOVERED_RANGE: `${RDP_DAY}_hovered`,
    DATERANGEPICKER3_DAY_HOVERED_RANGE_END: `${RDP_DAY}_hovered_end`,
    DATERANGEPICKER3_DAY_HOVERED_RANGE_START: `${RDP_DAY}_hovered_start`,
    DATERANGEPICKER3_DAY_RANGE_END: `${RDP_DAY}_range_end`,
    DATERANGEPICKER3_DAY_RANGE_MIDDLE: `${RDP_DAY}_range_middle`,
    DATERANGEPICKER3_DAY_RANGE_START: `${RDP_DAY}_range_start`,
    DATERANGEPICKER_REVERSE_MONTH_AND_YEAR: `${DatetimeClasses.DATERANGEPICKER}-reverse-month-and-year`,
};

export const Classes = {
    ...DatetimeClasses,
    ...DatePicker3Classes,
    ...DateRangePicker3Classes,
    ...ReactDayPickerClasses,
};

/**
 * Class name overrides for components rendered by react-day-picker. These are helpful so that @blueprintjs/datetime2
 * can have more predictable and standard DOM selectors in custom styles & tests.
 */
export const dayPickerClassNameOverrides: Partial<StyledElement<string>> = {
    /* eslint-disable camelcase */
    button: classNames(CoreClasses.BUTTON, CoreClasses.MINIMAL),
    button_reset: undefined,
    nav_button: Classes.DATEPICKER_NAV_BUTTON,
    nav_button_next: Classes.DATEPICKER_NAV_BUTTON_NEXT,
    nav_button_previous: Classes.DATEPICKER_NAV_BUTTON_PREVIOUS,
    /* eslint-enable camelcase */
};
