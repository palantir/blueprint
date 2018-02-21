/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange, handleStringChange } from "@blueprintjs/docs-theme";
import * as React from "react";

import { DateInput, TimePickerPrecision } from "@blueprintjs/datetime";
import { FORMATS, FormatSelect } from "./common/formatSelect";
import { PrecisionSelect } from "./common/precisionSelect";

export interface IDateInputExampleState {
    closeOnSelection?: boolean;
    disabled?: boolean;
    formatKey?: string;
    openOnFocus?: boolean;
    reverseMonthAndYearMenus?: boolean;
    timePrecision?: TimePickerPrecision;
}

export class DateInputExample extends BaseExample<IDateInputExampleState> {
    public state: IDateInputExampleState = {
        closeOnSelection: true,
        disabled: false,
        formatKey: Object.keys(FORMATS)[0],
        openOnFocus: true,
        reverseMonthAndYearMenus: false,
    };

    private toggleFocus = handleBooleanChange(openOnFocus => this.setState({ openOnFocus }));
    private toggleSelection = handleBooleanChange(closeOnSelection => this.setState({ closeOnSelection }));
    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));
    private toggleFormat = handleStringChange(formatKey => this.setState({ formatKey }));
    private toggleReverseMonthAndYearMenus = handleBooleanChange(reverseMonthAndYearMenus =>
        this.setState({ reverseMonthAndYearMenus }),
    );
    private toggleTimePrecision = handleNumberChange(timePrecision =>
        this.setState({
            timePrecision: timePrecision < 0 ? undefined : timePrecision,
        }),
    );

    protected renderExample() {
        const { formatKey, ...spreadableState } = this.state;
        return (
            <DateInput
                {...spreadableState}
                format={FORMATS[formatKey]}
                defaultValue={new Date()}
                className="foofoofoo"
                popoverProps={{ popoverClassName: "barbarbar" }}
                inputProps={{ className: "bazbazbaz" }}
            />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.openOnFocus}
                    label="Open on input focus"
                    key="Focus"
                    onChange={this.toggleFocus}
                />,
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
            [<FormatSelect key="Format" onChange={this.toggleFormat} selectedValue={this.state.formatKey} />],
        ];
    }
}
