/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import {
    HTMLSelect,
    Intent,
    INumericInputProps,
    IOptionProps,
    Label,
    NumericInput,
    Position,
    Switch,
} from "@blueprintjs/core";
import {
    Example,
    handleBooleanChange,
    handleNumberChange,
    handleStringChange,
    IExampleProps,
} from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

const MIN_VALUES = [
    { label: "None", value: -Infinity },
    { label: "-10", value: -10 },
    { label: "0", value: 0 },
    { label: "10", value: 10 },
];

const MAX_VALUES = [
    { label: "None", value: +Infinity },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
];

const BUTTON_POSITIONS = [
    { label: "None", value: "none" },
    { label: "Left", value: Position.LEFT },
    { label: "Right", value: Position.RIGHT },
];

export class NumericInputBasicExample extends React.PureComponent<IExampleProps, INumericInputProps> {
    public state: INumericInputProps = {
        allowNumericCharactersOnly: true,
        buttonPosition: "right",
        disabled: false,
        fill: false,
        intent: Intent.NONE,
        large: false,
        majorStepSize: 10,
        max: 100,
        min: 0,
        minorStepSize: 0.1,
        selectAllOnFocus: false,
        selectAllOnIncrement: false,
        stepSize: 1,
        value: "",
    };

    private handleMaxChange = handleNumberChange(max => this.setState({ max }));
    private handleMinChange = handleNumberChange(min => this.setState({ min }));
    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));

    private handleButtonPositionChange = handleStringChange((buttonPosition: INumericInputProps["buttonPosition"]) =>
        this.setState({ buttonPosition }),
    );

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));
    private toggleLeftIcon = handleBooleanChange(leftIcon =>
        this.setState({ leftIcon: leftIcon ? "dollar" : undefined }),
    );
    private toggleFullWidth = handleBooleanChange(fill => this.setState({ fill }));
    private toggleLargeSize = handleBooleanChange(large => this.setState({ large }));
    private toggleNumericCharsOnly = handleBooleanChange(allowNumericCharactersOnly =>
        this.setState({ allowNumericCharactersOnly }),
    );
    private toggleSelectAllOnFocus = handleBooleanChange(selectAllOnFocus => this.setState({ selectAllOnFocus }));
    private toggleSelectAllOnIncrement = handleBooleanChange(selectAllOnIncrement => {
        this.setState({ selectAllOnIncrement });
    });

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <NumericInput {...this.state} placeholder="Enter a number..." onValueChange={this.handleValueChange} />
            </Example>
        );
    }

    protected renderOptions() {
        const {
            buttonPosition,
            intent,
            max,
            min,
            allowNumericCharactersOnly,
            selectAllOnFocus,
            selectAllOnIncrement,
            disabled,
            fill,
            large,
            leftIcon,
        } = this.state;

        return (
            <>
                <Label>Modifiers</Label>
                {this.renderSwitch("Numeric characters only", allowNumericCharactersOnly, this.toggleNumericCharsOnly)}
                {this.renderSwitch("Select all on focus", selectAllOnFocus, this.toggleSelectAllOnFocus)}
                {this.renderSwitch("Select all on increment", selectAllOnIncrement, this.toggleSelectAllOnIncrement)}
                {this.renderSwitch("Disabled", disabled, this.toggleDisabled)}
                {this.renderSwitch("Left icon", leftIcon != null, this.toggleLeftIcon)}
                {this.renderSwitch("Fill container", fill, this.toggleFullWidth)}
                {this.renderSwitch("Large", large, this.toggleLargeSize)}
                {this.renderSelectMenu("Minimum value", min, MIN_VALUES, this.handleMinChange)}
                {this.renderSelectMenu("Maximum value", max, MAX_VALUES, this.handleMaxChange)}
                {this.renderSelectMenu(
                    "Button position",
                    buttonPosition,
                    BUTTON_POSITIONS,
                    this.handleButtonPositionChange,
                )}
                <IntentSelect intent={intent} onChange={this.handleIntentChange} />
            </>
        );
    }

    private renderSwitch(label: string, checked: boolean, onChange: React.FormEventHandler<HTMLElement>) {
        return <Switch checked={checked} label={label} onChange={onChange} />;
    }

    private renderSelectMenu(
        label: string,
        selectedValue: number | string,
        options: IOptionProps[],
        onChange: React.FormEventHandler<HTMLElement>,
    ) {
        return (
            <Label>
                {label}
                <HTMLSelect value={selectedValue} onChange={onChange} options={options} />
            </Label>
        );
    }

    private handleValueChange = (_valueAsNumber: number, valueAsString: string) => {
        this.setState({ value: valueAsString });
    };
}
