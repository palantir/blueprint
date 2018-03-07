/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Switch } from "@blueprintjs/core";
import { DateInput, IDateFormatProps, TimePickerPrecision } from "@blueprintjs/datetime";
import { BaseExample, handleBooleanChange, handleNumberChange } from "@blueprintjs/docs-theme";
import * as React from "react";

import { FORMATS, FormatSelect } from "./common/formatSelect";
import { MomentDate } from "./common/momentDate";
import { PrecisionSelect } from "./common/precisionSelect";

export interface IDateInputExampleState {
    closeOnSelection: boolean;
    date: Date | null;
    disabled: boolean;
    format: IDateFormatProps;
    reverseMonthAndYearMenus: boolean;
    timePrecision: TimePickerPrecision | undefined;
}

export class DateInputExample extends BaseExample<IDateInputExampleState> {
    public state: IDateInputExampleState = {
        closeOnSelection: true,
        date: null,
        disabled: false,
        format: FORMATS[0],
        reverseMonthAndYearMenus: false,
        timePrecision: undefined,
    };

    private toggleSelection = handleBooleanChange(closeOnSelection => this.setState({ closeOnSelection }));
    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));
    private toggleReverseMonthAndYearMenus = handleBooleanChange(reverseMonthAndYearMenus =>
        this.setState({ reverseMonthAndYearMenus }),
    );
    private toggleTimePrecision = handleNumberChange(timePrecision =>
        this.setState({
            timePrecision: timePrecision < 0 ? undefined : timePrecision,
        }),
    );

    protected renderExample() {
        const { date, format, ...spreadProps } = this.state;
        return (
            <div>
                <DateInput
                    {...spreadProps}
                    {...format}
                    defaultValue={new Date()}
                    className="foofoofoo"
                    onChange={this.handleDateChange}
                    popoverProps={{ popoverClassName: "barbarbar" }}
                    inputProps={{ className: "bazbazbaz" }}
                />{" "}
                <MomentDate date={date} />
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.closeOnSelection}
                    label="Close on selection"
                    key="Selection"
                    onChange={this.toggleSelection}
                />,
                <Switch checked={this.state.disabled} label="Disabled" key="Disabled" onChange={this.toggleDisabled} />,
                <Switch
                    checked={this.state.reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    key="Reverse month and year menus"
                    onChange={this.toggleReverseMonthAndYearMenus}
                />,
                <PrecisionSelect
                    label="Time Precision"
                    key="precision"
                    allowEmpty={true}
                    value={this.state.timePrecision}
                    onChange={this.toggleTimePrecision}
                />,
            ],
            [<FormatSelect key="Format" format={this.state.format} onChange={this.handleFormatChange} />],
        ];
    }

    private handleDateChange = (date: Date | null) => this.setState({ date });
    private handleFormatChange = (format: IDateFormatProps) => this.setState({ format });
}
