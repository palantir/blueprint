/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange } from "@blueprintjs/docs";
import * as moment from "moment";
import * as React from "react";

import { DateRange, DateRangePicker } from "../src";
import { Moment } from "./datePickerExample";

export interface IDateRangePickerExampleState {
    allowSingleDayRange?: boolean;
    contiguousCalendarMonths?: boolean;
    dateRange?: DateRange;
    maxDateIndex?: number;
    minDateIndex?: number;
    shortcuts?: boolean;
}

interface ISelectOption {
    label: string;
    value?: Date;
}

const MIN_DATE_OPTIONS: ISelectOption[] = [
    { label: "None", value: undefined },
    { label: "4 months ago", value: moment().add(-4, "months").toDate() },
    { label: "1 year ago", value: moment().add(-1, "years").toDate() },
];

const MAX_DATE_OPTIONS: ISelectOption[] = [
    { label: "None", value: undefined },
    { label: "1 month ago", value: moment().add(-1, "months").toDate() },
];

export class DateRangePickerExample extends BaseExample<IDateRangePickerExampleState> {
    public state: IDateRangePickerExampleState = {
        allowSingleDayRange: false,
        contiguousCalendarMonths: true,
        dateRange: [null, null],
        maxDateIndex: 0,
        minDateIndex: 0,
        shortcuts: true,
    };

    private handleMaxDateIndexChange = handleNumberChange((maxDateIndex) => this.setState({ maxDateIndex }));
    private handleMinDateIndexChange = handleNumberChange((minDateIndex) => this.setState({ minDateIndex }));

    private toggleSingleDay = handleBooleanChange((allowSingleDayRange) => this.setState({ allowSingleDayRange }));
    private toggleShortcuts = handleBooleanChange((shortcuts) => this.setState({ shortcuts }));
    private toggleContiguousCalendarMonths = handleBooleanChange((contiguousCalendarMonths) => {
        this.setState({ contiguousCalendarMonths });
    });

    protected renderExample() {
        const [start, end] = this.state.dateRange;

        const minDate = MIN_DATE_OPTIONS[this.state.minDateIndex].value;
        const maxDate = MAX_DATE_OPTIONS[this.state.maxDateIndex].value;

        return <div className="docs-datetime-example">
            <DateRangePicker
                allowSingleDayRange={this.state.allowSingleDayRange}
                contiguousCalendarMonths={this.state.contiguousCalendarMonths}
                className={Classes.ELEVATION_1}
                maxDate={maxDate}
                minDate={minDate}
                onChange={this.handleDateChange}
                shortcuts={this.state.shortcuts}
            />
            <div>
                <Moment date={start} />
                <span className={`${Classes.ICON_LARGE} ${Classes.iconClass("arrow-right")}`} />
                <Moment date={end} />
            </div>
        </div>;
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.allowSingleDayRange}
                    key="SingleDay"
                    label="Allow single day range"
                    onChange={this.toggleSingleDay}
                />,
                <Switch
                    checked={this.state.contiguousCalendarMonths}
                    key="Contiguous"
                    label="Constrain to contiguous months"
                    onChange={this.toggleContiguousCalendarMonths}
                />,
                <Switch
                    checked={this.state.shortcuts}
                    key="Shortcuts"
                    label="Show shortcuts"
                    onChange={this.toggleShortcuts}
                />,
            ], [
                this.renderSelectMenu(
                    "Minimum date",
                    this.state.minDateIndex,
                    MIN_DATE_OPTIONS,
                    this.handleMinDateIndexChange,
                ),
            ], [
                this.renderSelectMenu(
                    "Maximum date",
                    this.state.maxDateIndex,
                    MAX_DATE_OPTIONS,
                    this.handleMaxDateIndexChange,
                ),
            ],
        ];
    }

    private handleDateChange = (dateRange: DateRange) => this.setState({ dateRange });

    private renderSelectMenu(
        label: string,
        selectedValue: number | string,
        options: ISelectOption[],
        onChange: React.FormEventHandler<HTMLElement>,
    ) {
        return (
            <label className={Classes.LABEL} key={label}>
                {label}
                <div className={Classes.SELECT}>
                    <select value={selectedValue} onChange={onChange}>
                        {this.renderSelectMenuOptions(options)}
                    </select>
                </div>
            </label>
        );
    }

    private renderSelectMenuOptions(options: ISelectOption[]) {
        return options.map((option, index) => {
            return <option key={index} value={index}>{option.label}</option>;
        });
    }
}
