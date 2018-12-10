/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Menu, MenuItem } from "@blueprintjs/core";
import React from "react";
import { DATERANGEPICKER_SHORTCUTS } from "./common/classes";
import { clone, DateRange, isDayRangeInRange } from "./common/dateUtils";

export interface IDateRangeShortcut {
    label: string;
    dateRange: DateRange;
    shouldChangeTime?: boolean;
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
