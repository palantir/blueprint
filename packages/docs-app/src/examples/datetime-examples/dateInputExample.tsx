/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Position, Switch } from "@blueprintjs/core";
import { DateInput, IDateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
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
    timePrecision: TimePrecision | undefined;
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
    private toggleTimePrecision = handleStringChange((timePrecision: TimePrecision) =>
        this.setState({ timePrecision }),
    );

    protected renderExample() {
        const { date, format, ...spreadProps } = this.state;
        return (
            <>
                <DateInput
                    {...spreadProps}
                    {...format}
                    defaultValue={new Date()}
                    onChange={this.handleDateChange}
                    popoverProps={{ position: Position.BOTTOM }}
                />
                <div className="docs-date-range">
                    <MomentDate date={date} />
                </div>
            </>
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
            ],
            [<FormatSelect key="Format" format={this.state.format} onChange={this.handleFormatChange} />],
            [
                <PrecisionSelect
                    label="Time Precision"
                    key="precision"
                    allowEmpty={true}
                    value={this.state.timePrecision}
                    onChange={this.toggleTimePrecision}
                />,
            ],
        ];
    }

    private handleDateChange = (date: Date | null) => this.setState({ date });
    private handleFormatChange = (format: IDateFormatProps) => this.setState({ format });
}
