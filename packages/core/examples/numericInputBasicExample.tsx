/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import {
    Classes,
    Intent,
    NumericInput,
    Position,
    Switch,
} from "@blueprintjs/core";

import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";

export interface INumericInputBasicExampleState {
    buttonPositionIndex?: number;

    minValueIndex?: number;
    maxValueIndex?: number;

    stepSizeIndex?: number;
    majorStepSizeIndex?: number;
    minorStepSizeIndex?: number;

    intent?: Intent;

    numericCharsOnly?: boolean;
    selectAllOnFocus?: boolean;
    selectAllOnIncrement?: boolean;
    showDisabled?: boolean;
    showFullWidth?: boolean;
    showLargeSize?: boolean;
    showLeftIcon?: boolean;
    showReadOnly?: boolean;

    value?: string;
}

interface ISelectOption {
    label: string;
    value: any;
}

const MIN_VALUES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "-10", value: -10 },
    { label: "0", value: 0 },
    { label: "10", value: 10 },
];

const MAX_VALUES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
];

const BUTTON_POSITIONS: ISelectOption[] = [
    { label: "None", value: null },
    { label: "Left", value: Position.LEFT },
    { label: "Right", value: Position.RIGHT },
];

export class NumericInputBasicExample extends BaseExample<INumericInputBasicExampleState> {

    public state: INumericInputBasicExampleState = {
        buttonPositionIndex: 2,
        intent: Intent.NONE,
        majorStepSizeIndex: 1,
        maxValueIndex: 0,
        minValueIndex: 0,
        minorStepSizeIndex: 1,

        numericCharsOnly: true,
        selectAllOnFocus: false,
        selectAllOnIncrement: false,
        showDisabled: false,
        showFullWidth: false,
        showLeftIcon: false,
        showReadOnly: false,

        stepSizeIndex: 0,

        value: "",
    };

    private handleMaxValueChange = handleNumberChange((maxValueIndex) => this.setState({ maxValueIndex }));
    private handleMinValueChange = handleNumberChange((minValueIndex) => this.setState({ minValueIndex }));
    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));

    private handleButtonPositionChange = handleNumberChange((buttonPositionIndex) => {
        this.setState({ buttonPositionIndex });
    });

    private toggleDisabled = handleBooleanChange((showDisabled) => this.setState({ showDisabled }));
    private toggleLeftIcon = handleBooleanChange((showLeftIcon) => this.setState({ showLeftIcon }));
    private toggleReadOnly = handleBooleanChange((showReadOnly) => this.setState({ showReadOnly }));
    private toggleFullWidth = handleBooleanChange((showFullWidth) => this.setState({ showFullWidth }));
    private toggleNumericCharsOnly = handleBooleanChange((numericCharsOnly) => this.setState({ numericCharsOnly }));
    private toggleSelectAllOnFocus = handleBooleanChange((selectAllOnFocus) => this.setState({ selectAllOnFocus }));
    private toggleSelectAllOnIncrement = handleBooleanChange((selectAllOnIncrement) => {
        this.setState({ selectAllOnIncrement });
    });

    protected renderOptions() {
        const {
            buttonPositionIndex,
            intent,
            maxValueIndex,
            minValueIndex,
            numericCharsOnly,
            selectAllOnFocus,
            selectAllOnIncrement,
            showDisabled,
            showFullWidth,
            showReadOnly,
            showLeftIcon,
        } = this.state;

        return [
            [
                <label className={Classes.LABEL} key="modifierslabel">Modifiers</label>,
                this.renderSwitch("Numeric characters only", numericCharsOnly, this.toggleNumericCharsOnly),
                this.renderSwitch("Select all on focus", selectAllOnFocus, this.toggleSelectAllOnFocus),
                this.renderSwitch("Select all on increment", selectAllOnIncrement, this.toggleSelectAllOnIncrement),
                this.renderSwitch("Disabled", showDisabled, this.toggleDisabled),
                this.renderSwitch("Read-only", showReadOnly, this.toggleReadOnly),
                this.renderSwitch("Left icon", showLeftIcon, this.toggleLeftIcon),
                this.renderSwitch("Full width", showFullWidth, this.toggleFullWidth),
            ], [
                this.renderSelectMenu("Minimum value", minValueIndex, MIN_VALUES, this.handleMinValueChange),
                this.renderSelectMenu("Maximum value", maxValueIndex, MAX_VALUES, this.handleMaxValueChange),
            ], [
                this.renderSelectMenu(
                    "Button position", buttonPositionIndex, BUTTON_POSITIONS, this.handleButtonPositionChange),
                <IntentSelect intent={intent} key="intent" onChange={this.handleIntentChange} />,
            ],
        ];
    }

    protected renderExample() {
        return (
            <div className="docs-react-numeric-input-example">
                <NumericInput
                    allowNumericCharactersOnly={this.state.numericCharsOnly}
                    buttonPosition={BUTTON_POSITIONS[this.state.buttonPositionIndex].value}
                    className={classNames({ [Classes.FILL]: this.state.showFullWidth })}
                    intent={this.state.intent}

                    min={MIN_VALUES[this.state.minValueIndex].value}
                    max={MAX_VALUES[this.state.maxValueIndex].value}

                    stepSize={1}
                    majorStepSize={10}
                    minorStepSize={0.1}

                    disabled={this.state.showDisabled}
                    readOnly={this.state.showReadOnly}
                    leftIconName={this.state.showLeftIcon ? "dollar" : null}
                    placeholder="Enter a number..."

                    selectAllOnFocus={this.state.selectAllOnFocus}
                    selectAllOnIncrement={this.state.selectAllOnIncrement}

                    onValueChange={this.handleValueChange}
                    value={this.state.value}
                />
            </div>
        );
    }

    private renderSwitch(label: string, checked: boolean, onChange: React.FormEventHandler<HTMLElement>) {
       return (
            <Switch
                checked={checked}
                label={label}
                key={label}
                onChange={onChange}
            />
        );
    }

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

    private handleValueChange = (_valueAsNumber: number, valueAsString: string) => {
        this.setState({ value: valueAsString });
    }
}
