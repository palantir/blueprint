/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { H5, Position, Switch } from "@blueprintjs/core";
import { DateInput, IDateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
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
    private toggleTimePrecision = handleStringChange((timePrecision: TimePrecision | "none") =>
        this.setState({ timePrecision: timePrecision === "none" ? undefined : timePrecision }),
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
                <MomentDate date={date} />
            </Example>
        );
    }

    protected renderOptions() {
        const { closeOnSelection, disabled, reverseMonthAndYearMenus: reverse, format, timePrecision } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch label="Close on selection" checked={closeOnSelection} onChange={this.toggleSelection} />
                <Switch label="Disabled" checked={disabled} onChange={this.toggleDisabled} />
                <Switch label="Reverse month and year menus" checked={reverse} onChange={this.toggleReverseMenus} />
                <FormatSelect format={format} onChange={this.handleFormatChange} />
                <PrecisionSelect
                    allowNone={true}
                    label="Time precision"
                    onChange={this.toggleTimePrecision}
                    value={timePrecision}
                />
            </>
        );
    }

    private handleDateChange = (date: Date | null) => this.setState({ date });
    private handleFormatChange = (format: IDateFormatProps) => this.setState({ format });
}
