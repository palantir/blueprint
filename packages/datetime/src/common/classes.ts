/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { Classes } from "@blueprintjs/core";

const NS = Classes.getClassNamespace();

export const DATE_INPUT = `${NS}-date-input`;
export const DATE_INPUT_POPOVER = `${NS}-date-input-popover`;
export const DATE_INPUT_TIMEZONE_SELECT = `${NS}-date-input-timezone-select`;

export const DATEPICKER = `${NS}-datepicker`;
export const DATEPICKER_CAPTION = `${DATEPICKER}-caption`;
export const DATEPICKER_CAPTION_CARET = `${DATEPICKER_CAPTION}-caret`;
export const DATEPICKER_CAPTION_MEASURE = `${DATEPICKER_CAPTION}-measure`;
export const DATEPICKER_CAPTION_SELECT = `${DATEPICKER_CAPTION}-select`;
export const DATEPICKER_CONTENT = `${DATEPICKER}-content`;
export const DATEPICKER_DAY = "DayPicker-Day";
export const DATEPICKER_DAY_DISABLED = `${DATEPICKER_DAY}--disabled`;
export const DATEPICKER_DAY_OUTSIDE = `${DATEPICKER_DAY}--outside`;
export const DATEPICKER_DAY_SELECTED = `${DATEPICKER_DAY}--selected`;
export const DATEPICKER_DAY_IS_TODAY = `${DATEPICKER_DAY}--isToday`;
export const DATEPICKER_DAY_WRAPPER = `${DATEPICKER}-day-wrapper`;
export const DATEPICKER_FOOTER = `${DATEPICKER}-footer`;
export const DATEPICKER_MONTH_SELECT = `${DATEPICKER}-month-select`;
export const DATEPICKER_YEAR_SELECT = `${DATEPICKER}-year-select`;
export const DATEPICKER_NAVBAR = `${DATEPICKER}-navbar`;
export const DATEPICKER_NAVBUTTON = `DayPicker-NavButton`;
export const DATEPICKER_TIMEPICKER_WRAPPER = `${DATEPICKER}-timepicker-wrapper`;

export const DATERANGEPICKER = `${NS}-daterangepicker`;
export const DATERANGEPICKER_CALENDARS = `${DATERANGEPICKER}-calendars`;
export const DATERANGEPICKER_CONTIGUOUS = `${DATERANGEPICKER}-contiguous`;
export const DATERANGEPICKER_SINGLE_MONTH = `${DATERANGEPICKER}-single-month`;
export const DATERANGEPICKER_DAY_SELECTED_RANGE = `${DATEPICKER_DAY}--selected-range`;
export const DATERANGEPICKER_DAY_HOVERED_RANGE = `${DATEPICKER_DAY}--hovered-range`;
export const DATERANGEPICKER_SHORTCUTS = `${DATERANGEPICKER}-shortcuts`;
export const DATERANGEPICKER_TIMEPICKERS = `${DATERANGEPICKER}-timepickers`;

export const DATE_RANGE_INPUT = `${NS}-date-range-input`;
export const DATE_RANGE_INPUT_POPOVER = `${NS}-date-range-input-popover`;

export const TIMEPICKER = `${NS}-timepicker`;
export const TIMEPICKER_ARROW_BUTTON = `${TIMEPICKER}-arrow-button`;
export const TIMEPICKER_ARROW_ROW = `${TIMEPICKER}-arrow-row`;
export const TIMEPICKER_DIVIDER_TEXT = `${TIMEPICKER}-divider-text`;
export const TIMEPICKER_HOUR = `${TIMEPICKER}-hour`;
export const TIMEPICKER_INPUT = `${TIMEPICKER}-input`;
export const TIMEPICKER_INPUT_ROW = `${TIMEPICKER}-input-row`;
export const TIMEPICKER_MILLISECOND = `${TIMEPICKER}-millisecond`;
export const TIMEPICKER_MINUTE = `${TIMEPICKER}-minute`;
export const TIMEPICKER_SECOND = `${TIMEPICKER}-second`;
export const TIMEPICKER_AMPM_SELECT = `${TIMEPICKER}-ampm-select`;

export const TIMEZONE_SELECT = `${NS}-timezone-select`;
export const TIMEZONE_SELECT_POPOVER = `${TIMEZONE_SELECT}-popover`;

// BEGIN DATETIME2 CLASS NAMES

const RDP = "rdp";
const RDP_DAY = `${RDP}-day`;

/** Class names applied by react-day-picker v8.x */
export const ReactDayPickerClasses = {
    RDP,
    RDP_CAPTION: `${RDP}-caption`,
    RDP_CAPTION_DROPDOWNS: `${RDP}-caption_dropdowns`,
    RDP_CAPTION_LABEL: `${RDP}-caption_label`,
    RDP_DAY,
    RDP_DAY_DISABLED: `${RDP_DAY}_disabled`,
    RDP_DAY_HOVERED_RANGE: `${RDP_DAY}_hovered`,
    RDP_DAY_HOVERED_RANGE_END: `${RDP_DAY}_hovered_end`,
    RDP_DAY_HOVERED_RANGE_START: `${RDP_DAY}_hovered_start`,
    RDP_DAY_OUTSIDE: `${RDP_DAY}_outside`,
    RDP_DAY_RANGE_END: `${RDP_DAY}_range_end`,
    RDP_DAY_RANGE_MIDDLE: `${RDP_DAY}_range_middle`,
    RDP_DAY_RANGE_START: `${RDP_DAY}_range_start`,
    RDP_DAY_SELECTED: `${RDP_DAY}_selected`,
    RDP_DAY_TODAY: `${RDP_DAY}_today`,
    RDP_MONTH: `${RDP}-month`,
    RDP_NAV: `${RDP}-nav`,
    RDP_TABLE: `${RDP}-table`,
    RDP_VHIDDEN: `${RDP}-vhidden`,
};

export const DatePicker3CaptionClasses = {
    DATEPICKER3_CAPTION: DATEPICKER_CAPTION,
    DATEPICKER3_DROPDOWN_MONTH: DATEPICKER_MONTH_SELECT,
    DATEPICKER3_DROPDOWN_YEAR: DATEPICKER_YEAR_SELECT,
    DATEPICKER3_NAV_BUTTON: `${DATEPICKER}-nav-button`,
    DATEPICKER3_NAV_BUTTON_NEXT: `${DATEPICKER}-nav-button-next`,
    DATEPICKER3_NAV_BUTTON_PREVIOUS: `${DATEPICKER}-nav-button-previous`,
};

export const {
    DATEPICKER3_CAPTION,
    DATEPICKER3_DROPDOWN_MONTH,
    DATEPICKER3_DROPDOWN_YEAR,
    DATEPICKER3_NAV_BUTTON,
    DATEPICKER3_NAV_BUTTON_NEXT,
    DATEPICKER3_NAV_BUTTON_PREVIOUS,
} = DatePicker3CaptionClasses;

export const DatePicker3Classes = {
    DATEPICKER3_DAY: RDP_DAY,
    DATEPICKER3_DAY_DISABLED: ReactDayPickerClasses.RDP_DAY_DISABLED,
    DATEPICKER3_DAY_IS_TODAY: ReactDayPickerClasses.RDP_DAY_TODAY,
    DATEPICKER3_DAY_OUTSIDE: ReactDayPickerClasses.RDP_DAY_OUTSIDE,
    DATEPICKER3_DAY_SELECTED: ReactDayPickerClasses.RDP_DAY_SELECTED,
    DATEPICKER3_HIGHLIGHT_CURRENT_DAY: `${DATEPICKER}-highlight-current-day`,
    DATEPICKER3_REVERSE_MONTH_AND_YEAR: `${DATEPICKER}-reverse-month-and-year`,
};

export const {
    DATEPICKER3_DAY,
    DATEPICKER3_DAY_DISABLED,
    DATEPICKER3_DAY_IS_TODAY,
    DATEPICKER3_DAY_OUTSIDE,
    DATEPICKER3_DAY_SELECTED,
    DATEPICKER3_HIGHLIGHT_CURRENT_DAY,
    DATEPICKER3_REVERSE_MONTH_AND_YEAR,
} = DatePicker3Classes;

export const DateRangePicker3Classes = {
    DATERANGEPICKER3_HOVERED_RANGE: ReactDayPickerClasses.RDP_DAY_HOVERED_RANGE,
    DATERANGEPICKER3_HOVERED_RANGE_END: ReactDayPickerClasses.RDP_DAY_HOVERED_RANGE_END,
    DATERANGEPICKER3_HOVERED_RANGE_START: ReactDayPickerClasses.RDP_DAY_HOVERED_RANGE_START,
    DATERANGEPICKER3_REVERSE_MONTH_AND_YEAR: `${DATERANGEPICKER}-reverse-month-and-year`,
    DATERANGEPICKER3_SELECTED_RANGE_END: ReactDayPickerClasses.RDP_DAY_RANGE_END,
    DATERANGEPICKER3_SELECTED_RANGE_MIDDLE: ReactDayPickerClasses.RDP_DAY_RANGE_MIDDLE,
    DATERANGEPICKER3_SELECTED_RANGE_START: ReactDayPickerClasses.RDP_DAY_RANGE_START,
    DATERANGEPICKER3_TIMEPICKERS_STACKED: `${DATERANGEPICKER_TIMEPICKERS}-stacked`,
};

export const {
    DATERANGEPICKER3_HOVERED_RANGE,
    DATERANGEPICKER3_HOVERED_RANGE_END,
    DATERANGEPICKER3_HOVERED_RANGE_START,
    DATERANGEPICKER3_REVERSE_MONTH_AND_YEAR,
    DATERANGEPICKER3_SELECTED_RANGE_END,
    DATERANGEPICKER3_SELECTED_RANGE_MIDDLE,
    DATERANGEPICKER3_SELECTED_RANGE_START,
    DATERANGEPICKER3_TIMEPICKERS_STACKED,
} = DateRangePicker3Classes;

/**
 * Class name overrides for components rendered by react-day-picker. These are helpful so that @blueprintjs/datetime2
 * can have more predictable and standard DOM selectors in custom styles & tests.
 */
export const dayPickerClassNameOverrides: Partial<StyledElement<string>> = {
    /* eslint-disable camelcase */
    button: classNames(Classes.BUTTON, Classes.MINIMAL),
    // no need for button "reset" styles since the core Button styles handle that for us
    button_reset: undefined,
    dropdown_month: DatePicker3CaptionClasses.DATEPICKER3_DROPDOWN_MONTH,
    dropdown_year: DatePicker3CaptionClasses.DATEPICKER3_DROPDOWN_YEAR,
    nav_button: DatePicker3CaptionClasses.DATEPICKER3_NAV_BUTTON,
    nav_button_next: DatePicker3CaptionClasses.DATEPICKER3_NAV_BUTTON_NEXT,
    nav_button_previous: DatePicker3CaptionClasses.DATEPICKER3_NAV_BUTTON_PREVIOUS,
    /* eslint-enable camelcase */
};
