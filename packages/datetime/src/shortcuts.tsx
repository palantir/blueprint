/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, Menu, MenuItem } from "@blueprintjs/core";
import * as React from "react";
import { DATERANGEPICKER_SHORTCUTS } from "./common/classes";
import { clone, DateRange, isDayRangeInRange } from "./common/dateUtils";
import { TimePrecision } from "./timePicker";

export interface IDateShortcutBase {
    /** Shortcut label that appears in the list. */
    label: string;

    /**
     * Set this prop to `true` to allow this shortcut to change the selected
     * times as well as the dates. By default, time components of a shortcut are
     * ignored; clicking a shortcut takes the date components of the `dateRange`
     * and combines them with the currently selected time.
     * @default false
     */
    includeTime?: boolean;
}

export interface IDateRangeShortcut extends IDateShortcutBase {
    /**
     * Date range represented by this shortcut. Note that time components of a
     * shortcut are ignored by default; set `includeTime: true` to respect them.
     */
    dateRange: DateRange;
}

export interface IDatePickerShortcut extends IDateShortcutBase {
    /**
     * Date represented by this shortcut. Note that time components of a
     * shortcut are ignored by default; set `includeTime: true` to respect them.
     */
    date: Date;
}

export interface IShortcutsProps {
    allowSingleDayRange: boolean;
    minDate: Date;
    maxDate: Date;
    shortcuts: IDateRangeShortcut[] | true;
    timePrecision: TimePrecision;
    selectedShortcutIndex?: number;
    onShortcutClick: (shortcut: IDateRangeShortcut, index: number) => void;
    /**
     * The DatePicker component reuses this component for a single date.
     * This changes the default shortcut labels and affects which shortcuts are used.
     * @default false
     */
    useSingleDateShortcuts?: boolean;
}

export class Shortcuts extends React.PureComponent<IShortcutsProps> {
    public static defaultProps: Partial<IShortcutsProps> = {
        selectedShortcutIndex: -1,
    };

    public render() {
        const shortcuts =
            this.props.shortcuts === true
                ? createDefaultShortcuts(
                      this.props.allowSingleDayRange,
                      this.props.timePrecision !== undefined,
                      this.props.useSingleDateShortcuts === true,
                  )
                : this.props.shortcuts;

        const shortcutElements = shortcuts.map((shortcut, index) => (
            <MenuItem
                active={this.props.selectedShortcutIndex === index}
                className={Classes.POPOVER_DISMISS_OVERRIDE}
                disabled={!this.isShortcutInRange(shortcut.dateRange)}
                key={index}
                onClick={this.getShorcutClickHandler(shortcut, index)}
                text={shortcut.label}
            />
        ));

        return (
            <Menu className={DATERANGEPICKER_SHORTCUTS} tabIndex={0}>
                {shortcutElements}
            </Menu>
        );
    }

    private getShorcutClickHandler = (shortcut: IDateRangeShortcut, index: number) => () => {
        const { onShortcutClick } = this.props;

        onShortcutClick(shortcut, index);
    };

    private isShortcutInRange = (shortcutDateRange: DateRange) => {
        const { minDate, maxDate } = this.props;

        return isDayRangeInRange(shortcutDateRange, [minDate, maxDate]);
    };
}

function createShortcut(label: string, dateRange: DateRange): IDateRangeShortcut {
    return { dateRange, label };
}

function createDefaultShortcuts(
    allowSingleDayRange: boolean,
    hasTimePrecision: boolean,
    useSingleDateShortcuts: boolean,
) {
    const today = new Date();
    const makeDate = (action: (d: Date) => void) => {
        const returnVal = clone(today);
        action(returnVal);
        returnVal.setDate(returnVal.getDate() + 1);
        return returnVal;
    };

    const tomorrow = makeDate(() => null);
    const yesterday = makeDate(d => d.setDate(d.getDate() - 2));
    const oneWeekAgo = makeDate(d => d.setDate(d.getDate() - 7));
    const oneMonthAgo = makeDate(d => d.setMonth(d.getMonth() - 1));
    const threeMonthsAgo = makeDate(d => d.setMonth(d.getMonth() - 3));
    const sixMonthsAgo = makeDate(d => d.setMonth(d.getMonth() - 6));
    const oneYearAgo = makeDate(d => d.setFullYear(d.getFullYear() - 1));
    const twoYearsAgo = makeDate(d => d.setFullYear(d.getFullYear() - 2));

    const singleDayShortcuts =
        allowSingleDayRange || useSingleDateShortcuts
            ? [
                  createShortcut("Today", [today, hasTimePrecision ? tomorrow : today]),
                  createShortcut("Yesterday", [yesterday, hasTimePrecision ? today : yesterday]),
              ]
            : [];

    return [
        ...singleDayShortcuts,
        createShortcut(useSingleDateShortcuts ? "1 week ago" : "Past week", [oneWeekAgo, today]),
        createShortcut(useSingleDateShortcuts ? "1 month ago" : "Past month", [oneMonthAgo, today]),
        createShortcut(useSingleDateShortcuts ? "3 months ago" : "Past 3 months", [threeMonthsAgo, today]),
        // Don't include a couple of these for the single date shortcut
        ...(useSingleDateShortcuts ? [] : [createShortcut("Past 6 months", [sixMonthsAgo, today])]),
        createShortcut(useSingleDateShortcuts ? "1 year ago" : "Past year", [oneYearAgo, today]),
        ...(useSingleDateShortcuts ? [] : [createShortcut("Past 2 years", [twoYearsAgo, today])]),
    ];
}
