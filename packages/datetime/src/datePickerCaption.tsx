/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { HTMLSelect, IOptionProps, Utils } from "@blueprintjs/core";
import * as React from "react";
import { CaptionElementProps } from "react-day-picker/types/props";

import * as Classes from "./common/classes";
import { clone } from "./common/dateUtils";
import { measureTextWidth } from "./common/utils";

export interface IDatePickerCaptionProps extends CaptionElementProps {
    maxDate: Date;
    minDate: Date;
    onMonthChange?: (month: number) => void;
    onYearChange?: (year: number) => void;
    /** Callback invoked when the month or year `<select>` is changed. */
    onDateChange?: (date: Date) => void;
    reverseMonthAndYearMenus?: boolean;
}

export interface IDatePickerCaptionState {
    monthWidth: number;
}

export class DatePickerCaption extends React.PureComponent<IDatePickerCaptionProps, IDatePickerCaptionState> {
    public state: IDatePickerCaptionState = { monthWidth: 0 };

    private containerElement: HTMLElement;
    private displayedMonthText: string;
    private monthWidthsCache: Record<string, number> = {};

    private handleMonthSelectChange = this.dateChangeHandler((d, month) => d.setMonth(month), this.props.onMonthChange);
    private handleYearSelectChange = this.dateChangeHandler((d, year) => d.setFullYear(year), this.props.onYearChange);

    public render() {
        const { date, locale, localeUtils, minDate, maxDate } = this.props;
        const minYear = minDate.getFullYear();
        const maxYear = maxDate.getFullYear();
        const displayMonth = date.getMonth();
        const displayYear = date.getFullYear();

        // build the list of available months, limiting based on minDate and maxDate as necessary
        const months = localeUtils.getMonths(locale);
        const startMonth = displayYear === minYear ? minDate.getMonth() : 0;
        const endMonth = displayYear === maxYear ? maxDate.getMonth() + 1 : undefined;
        const monthOptionElements = months
            .map<IOptionProps>((month, i) => ({ label: month, value: i }))
            .slice(startMonth, endMonth);

        const years: Array<number | IOptionProps> = [minYear];
        for (let year = minYear + 1; year <= maxYear; ++year) {
            years.push(year);
        }
        // allow out-of-bounds years but disable the option. this handles the Dec 2016 case in #391.
        if (displayYear > maxYear) {
            years.push({ value: displayYear, disabled: true });
        }

        this.displayedMonthText = months[displayMonth];

        const monthSelect = (
            <HTMLSelect
                iconProps={{ style: { left: this.state.monthWidth } }}
                className={Classes.DATEPICKER_MONTH_SELECT}
                key="month"
                minimal={true}
                onChange={this.handleMonthSelectChange}
                value={displayMonth}
                options={monthOptionElements}
            />
        );
        const yearSelect = (
            <HTMLSelect
                className={Classes.DATEPICKER_YEAR_SELECT}
                key="year"
                minimal={true}
                onChange={this.handleYearSelectChange}
                value={displayYear}
                options={years}
            />
        );

        const orderedSelects = this.props.reverseMonthAndYearMenus
            ? [yearSelect, monthSelect]
            : [monthSelect, yearSelect];

        return (
            <div className={this.props.classNames.caption}>
                <div className={Classes.DATEPICKER_CAPTION} ref={ref => (this.containerElement = ref)}>
                    {orderedSelects}
                </div>
            </div>
        );
    }

    public componentDidMount() {
        requestAnimationFrame(() => this.positionArrows());
    }

    public componentDidUpdate() {
        this.positionArrows();
    }

    private positionArrows() {
        const cachedWidth = this.monthWidthsCache[this.displayedMonthText];
        // measure width of text as rendered inside our container element and cache the result.
        const monthWidth =
            cachedWidth != null
                ? cachedWidth
                : measureTextWidth(this.displayedMonthText, Classes.DATEPICKER_CAPTION_MEASURE, this.containerElement);
        this.monthWidthsCache[this.displayedMonthText] = monthWidth;
        this.setState({ monthWidth });
    }

    private dateChangeHandler(updater: (date: Date, value: number) => void, handler?: (value: number) => void) {
        return (e: React.FormEvent<HTMLSelectElement>) => {
            const value = parseInt((e.target as HTMLSelectElement).value, 10);
            const newDate = clone(this.props.date);
            updater(newDate, value);
            Utils.safeInvoke(this.props.onDateChange, newDate);
            Utils.safeInvoke(handler, value);
        };
    }
}
