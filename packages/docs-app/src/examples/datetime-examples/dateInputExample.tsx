/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Position, Switch } from "@blueprintjs/core";
import { DateInput, IDateFormatProps, TimePickerPrecision } from "@blueprintjs/datetime";
import { Example, handleBooleanChange, handleNumberChange, IExampleProps } from "@blueprintjs/docs-theme";
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

export class DateInputExample extends React.PureComponent<IExampleProps, IDateInputExampleState> {
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
    private toggleReverseMenus = handleBooleanChange(reverse => this.setState({ reverseMonthAndYearMenus: reverse }));
    private toggleTimePrecision = handleNumberChange(timePrecision =>
        this.setState({ timePrecision: timePrecision < 0 ? undefined : timePrecision }),
    );

    public render() {
        const { date, format, ...spreadProps } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
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
            </Example>
        );
    }

    protected renderOptions() {
        const { closeOnSelection, disabled, reverseMonthAndYearMenus: reverse, format, timePrecision } = this.state;
        return (
            <>
                <Switch label="Close on selection" checked={closeOnSelection} onChange={this.toggleSelection} />
                <Switch label="Disabled" checked={disabled} onChange={this.toggleDisabled} />
                <Switch label="Reverse month and year menus" checked={reverse} onChange={this.toggleReverseMenus} />
                <FormatSelect format={format} onChange={this.handleFormatChange} />
                <PrecisionSelect
                    label="Time Precision"
                    allowEmpty={true}
                    value={timePrecision}
                    onChange={this.toggleTimePrecision}
                />
            </>
        );
    }

    private handleDateChange = (date: Date | null) => this.setState({ date });
    private handleFormatChange = (format: IDateFormatProps) => this.setState({ format });
}
