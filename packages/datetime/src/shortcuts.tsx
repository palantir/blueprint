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

export interface IDateRangeShortcut {
    /** Shortcut label that appears in the list. */
    label: string;

    /**
     * Date range represented by this shortcut. Note that time components of a
     * shortcut are ignored by default; set `includeTime: true` to respect them.
     */
    dateRange: DateRange;

    /**
     * Set this prop to `true` to allow this shortcut to change the selected
     * times as well as the dates. By default, time components of a shortcut are
     * ignored; clicking a shortcut takes the date components of the `dateRange`
     * and combines them with the currently selected time.
     * @default false
     */
    includeTime?: boolean;
}

export interface IShortcutsProps {
    allowSingleDayRange: boolean;
    minDate: Date;
    maxDate: Date;
    shortcuts: IDateRangeShortcut[] | true;
    onShortcutClick: (shortcut: IDateRangeShortcut) => void;
}

export class Shortcuts extends React.PureComponent<IShortcutsProps> {
    public render() {
        const shortcuts =
            this.props.shortcuts === true
                ? createDefaultShortcuts(this.props.allowSingleDayRange)
                : this.props.shortcuts;

        const shortcutElements = shortcuts.map((s, i) => (
            <MenuItem
                className={Classes.POPOVER_DISMISS_OVERRIDE}
                disabled={!this.isShortcutInRange(s.dateRange)}
                key={i}
                onClick={this.getShorcutClickHandler(s)}
                text={s.label}
            />
        ));

        return <Menu className={DATERANGEPICKER_SHORTCUTS}>{shortcutElements}</Menu>;
    }

    private getShorcutClickHandler(shortcut: IDateRangeShortcut) {
        return () => this.props.onShortcutClick(shortcut);
    }

    private isShortcutInRange(shortcutDateRange: DateRange) {
        return isDayRangeInRange(shortcutDateRange, [this.props.minDate, this.props.maxDate]);
    }
}

function createShortcut(label: string, dateRange: DateRange): IDateRangeShortcut {
    return { dateRange, label };
}

function createDefaultShortcuts(allowSingleDayRange: boolean) {
    const today = new Date();
    const makeDate = (action: (d: Date) => void) => {
        const returnVal = clone(today);
        action(returnVal);
        returnVal.setDate(returnVal.getDate() + 1);
        return returnVal;
    };

    const yesterday = makeDate(d => d.setDate(d.getDate() - 2));
    const oneWeekAgo = makeDate(d => d.setDate(d.getDate() - 7));
    const oneMonthAgo = makeDate(d => d.setMonth(d.getMonth() - 1));
    const threeMonthsAgo = makeDate(d => d.setMonth(d.getMonth() - 3));
    const sixMonthsAgo = makeDate(d => d.setMonth(d.getMonth() - 6));
    const oneYearAgo = makeDate(d => d.setFullYear(d.getFullYear() - 1));
    const twoYearsAgo = makeDate(d => d.setFullYear(d.getFullYear() - 2));

    const singleDayShortcuts = allowSingleDayRange
        ? [createShortcut("Today", [today, today]), createShortcut("Yesterday", [yesterday, yesterday])]
        : [];

    return [
        ...singleDayShortcuts,
        createShortcut("Past week", [oneWeekAgo, today]),
        createShortcut("Past month", [oneMonthAgo, today]),
        createShortcut("Past 3 months", [threeMonthsAgo, today]),
        createShortcut("Past 6 months", [sixMonthsAgo, today]),
        createShortcut("Past year", [oneYearAgo, today]),
        createShortcut("Past 2 years", [twoYearsAgo, today]),
    ];
}
