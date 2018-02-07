/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Icon, Utils as BlueprintUtils } from "@blueprintjs/core";
import * as React from "react";
import { CaptionElementProps } from "react-day-picker/types/props";

import * as Classes from "./common/classes";
import * as Utils from "./common/utils";

export interface IDatePickerCaptionProps extends CaptionElementProps {
    maxDate: Date;
    minDate: Date;
    onMonthChange?: (month: number) => void;
    onYearChange?: (year: number) => void;
    reverseMonthAndYearMenus?: boolean;
}

export interface IDatePickerCaptionState {
    monthWidth: number;
    yearWidth: number;
}

export class DatePickerCaption extends React.PureComponent<IDatePickerCaptionProps, IDatePickerCaptionState> {
    public state: IDatePickerCaptionState = {
        monthWidth: 0,
        yearWidth: 0,
    };

    private displayedMonthText: string;
    private displayedYearText: string;

    private containerElement: HTMLElement;

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
            .map((name, i) => {
                return (
                    <option key={i} value={i.toString()}>
                        {name}
                    </option>
                );
            })
            .slice(startMonth, endMonth);

        const years = [minYear];
        for (let year = minYear + 1; year <= maxYear; ++year) {
            years.push(year);
        }
        const yearOptionElements = years.map((year, i) => {
            return (
                <option key={i} value={year.toString()}>
                    {year}
                </option>
            );
        });
        // allow out-of-bounds years but disable the option. this handles the Dec 2016 case in #391.
        if (displayYear > maxYear) {
            yearOptionElements.push(
                <option key="next" disabled={true} value={displayYear.toString()}>
                    {displayYear}
                </option>,
            );
        }

        this.displayedMonthText = months[displayMonth];
        this.displayedYearText = displayYear.toString();

        const monthSelect = (
            <div className={Classes.DATEPICKER_CAPTION_SELECT} key="month">
                <select
                    className={Classes.DATEPICKER_MONTH_SELECT}
                    onChange={this.handleMonthSelectChange}
                    value={displayMonth.toString()}
                >
                    {monthOptionElements}
                </select>
                <Icon
                    className={Classes.DATEPICKER_CAPTION_CARET}
                    icon="caret-down"
                    style={{ left: this.state.monthWidth }}
                />
            </div>
        );
        const yearSelect = (
            <div className={Classes.DATEPICKER_CAPTION_SELECT} key="year">
                <select
                    className={Classes.DATEPICKER_YEAR_SELECT}
                    onChange={this.handleYearSelectChange}
                    value={displayYear.toString()}
                >
                    {yearOptionElements}
                </select>
                <Icon
                    className={Classes.DATEPICKER_CAPTION_CARET}
                    icon="caret-down"
                    style={{ left: this.state.yearWidth }}
                />
            </div>
        );

        const orderedSelects = this.props.reverseMonthAndYearMenus
            ? [yearSelect, monthSelect]
            : [monthSelect, yearSelect];

        return (
            <div className={Classes.DATEPICKER_CAPTION} ref={this.containerRefHandler}>
                {orderedSelects}
            </div>
        );
    }

    public componentDidMount() {
        this.positionArrows();
    }

    public componentDidUpdate() {
        this.positionArrows();
    }

    private containerRefHandler = (r: HTMLElement) => (this.containerElement = r);

    private positionArrows() {
        // pass our container element to the measureTextWidth utility to ensure
        // that we're measuring the width of text as sized within this component.
        const textClass = "pt-datepicker-caption-measure";
        const monthWidth = Utils.measureTextWidth(this.displayedMonthText, textClass, this.containerElement);
        const yearWidth = Utils.measureTextWidth(this.displayedYearText, textClass, this.containerElement);
        this.setState({ monthWidth, yearWidth });
    }

    private handleMonthSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const month = parseInt((e.target as HTMLSelectElement).value, 10);
        BlueprintUtils.safeInvoke(this.props.onMonthChange, month);
    };

    private handleYearSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const year = parseInt((e.target as HTMLSelectElement).value, 10);
        BlueprintUtils.safeInvoke(this.props.onYearChange, year);
    };
}
