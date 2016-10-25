/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Utils as BlueprintUtils } from "@blueprint/core";
import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "./common/classes";
import * as Utils from "./common/utils";
import { IDatePickerLocaleUtils } from "./datePickerCore";

export interface IDatePickerCaptionProps {
    maxDate: Date;
    minDate: Date;
    onMonthChange?: (month: number) => void;
    onYearChange?: (year: number) => void;

    // normally we could extend ReactDayPicker.CaptionElementProps,
    // but we don't want to introduce a typing dependency, so manually add props here
    date?: Date;
    localeUtils?: IDatePickerLocaleUtils;
    locale?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

export class DatePickerCaption extends React.Component<IDatePickerCaptionProps, {}> {
    private displayedMonthText: string;
    private displayedYearText: string;

    private monthArrow: HTMLElement;
    private yearArrow: HTMLElement;

    public render() {
        const { date, locale, localeUtils, minDate, maxDate } = this.props;
        const minYear = minDate.getFullYear();
        const maxYear = maxDate.getFullYear();
        const displayMonth = date.getMonth();
        const displayYear = date.getFullYear();

        // build the list of available months, limiting based on minDate and maxDate as necessary
        const months = localeUtils.getMonths(locale);
        const startMonth = (displayYear === minYear) ? minDate.getMonth() : 0;
        const endMonth = (displayYear === maxYear) ? maxDate.getMonth() + 1 : undefined;
        const monthOptionElements = months.map((name, i) => {
            return <option key={i} value={i.toString()}>{name}</option>;
        }).slice(startMonth, endMonth);

        const years = [minYear];
        for (let year = minYear + 1; year <= maxYear; ++year) {
            years.push(year);
        }
        const yearOptionElements = years.map((year, i) => {
            return <option key={i} value={year.toString()}>{year}</option>;
        });

        this.displayedMonthText = months[displayMonth];
        this.displayedYearText = displayYear.toString();

        const caretClasses = classNames("pt-icon-standard", "pt-icon-caret-down", Classes.DATEPICKER_CAPTION_CARET);
        return (
            <div className={Classes.DATEPICKER_CAPTION}>
                <div className={Classes.DATEPICKER_CAPTION_SELECT}>
                    <select
                        className={Classes.DATEPICKER_MONTH_SELECT}
                        onChange={this.handleMonthSelectChange}
                        value={displayMonth.toString()}
                    >
                        {monthOptionElements}
                    </select>
                    <span
                        className={caretClasses}
                        ref={this.monthArrowRefHandler}
                    />
                </div>
                <div className={Classes.DATEPICKER_CAPTION_SELECT}>
                    <select
                        className={Classes.DATEPICKER_YEAR_SELECT}
                        onChange={this.handleYearSelectChange}
                        value={displayYear.toString()}
                    >
                        {yearOptionElements}
                    </select>
                    <span
                        className={caretClasses}
                        ref={this.yearArrowRefHandler}
                    />
                </div>
            </div>
        );
    }

    public componentDidMount() {
        this.positionArrows();
    }

    public componentDidUpdate() {
        this.positionArrows();
    }

    private monthArrowRefHandler = (r: HTMLElement) => this.monthArrow = r;
    private yearArrowRefHandler = (r: HTMLElement) => this.yearArrow = r;

    private positionArrows() {
        const textClass = "pt-datepicker-caption-measure";
        const monthWidth = Utils.measureTextWidth(this.displayedMonthText, textClass);
        this.monthArrow.setAttribute("style", `left:${monthWidth}`);

        const yearWidth = Utils.measureTextWidth(this.displayedYearText, textClass);
        this.yearArrow.setAttribute("style", `left:${yearWidth}`);
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
