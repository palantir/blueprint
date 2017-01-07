/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import {
    Classes,
    Intent,
    NumericStepper,
    Switch,
    Position,
} from "@blueprintjs/core";

import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";

const SAMPLE_LEFT_ICON = "variable";
const SAMPLE_PLACEHOLDER = "Enter a number...";

export interface INumericStepperExampleState {

    buttonPositionIndex?: number;

    minValueIndex?: number;
    maxValueIndex?: number;

    stepSizeIndex?: number;
    majorStepSizeIndex?: number;
    minorStepSizeIndex?: number;

    intent?: Intent;

    showDisabled?: boolean;
    showLargeSize?: boolean;
    showLeftIcon?: boolean;
    showPlaceholder?: boolean;
    showReadOnly?: boolean;

    value?: string;
}

interface ISelectOption {
    label: string;
    value?: any;
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

const STEP_SIZES: ISelectOption[] = [
    { label: "1", value: 1 },
    { label: "1", value: 2 },
];

const MINOR_STEP_SIZES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "0.1", value: 0.1 },
    { label: "0.2", value: 0.2 },
];

const MAJOR_STEP_SIZES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
];

const BUTTON_POSITIONS: ISelectOption[] = [
    { label: "None", value: null },
    { label: "Left", value: Position.LEFT },
    { label: "Right", value: Position.RIGHT },
];

export class NumericStepperExample extends BaseExample<INumericStepperExampleState> {

    public state: INumericStepperExampleState = {
        buttonPositionIndex: 2,
        intent: Intent.NONE,
        majorStepSizeIndex: 1,
        maxValueIndex: 0,
        minValueIndex: 0,
        minorStepSizeIndex: 1,

        showDisabled: false,
        showLeftIcon: false,
        showPlaceholder: true,
        showReadOnly: false,

        stepSizeIndex: 0,

        value: null,
    };

    private handleMaxValueChange = handleNumberChange((maxValueIndex) => this.setState({ maxValueIndex }));
    private handleMinValueChange = handleNumberChange((minValueIndex) => this.setState({ minValueIndex }));
    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));

    private handleButtonPositionChange = handleNumberChange((buttonPositionIndex) => {
        this.setState({ buttonPositionIndex });
    });

    private toggleDisabled = handleBooleanChange((showDisabled) => this.setState({ showDisabled }));
    private toggleLeftIcon = handleBooleanChange((showLeftIcon) => this.setState({ showLeftIcon }));
    private togglePlaceholder = handleBooleanChange((showPlaceholder) => this.setState({ showPlaceholder }));
    private toggleReadOnly = handleBooleanChange((showReadOnly) => this.setState({ showReadOnly }));

    protected renderOptions() {
        const {
            buttonPositionIndex,
            intent,
            maxValueIndex,
            minValueIndex,
            showDisabled,
            showReadOnly,
            showLeftIcon,
            showPlaceholder,
        } = this.state;

        return [
            [
                this.renderSelectMenu("Minimum value", minValueIndex, MIN_VALUES, this.handleMinValueChange),
                this.renderSelectMenu("Maximum value", maxValueIndex, MAX_VALUES, this.handleMaxValueChange),
            ], [
                this.renderSelectMenu(
                    "Button position", buttonPositionIndex, BUTTON_POSITIONS, this.handleButtonPositionChange),
                <IntentSelect intent={intent} key="intent" onChange={this.handleIntentChange} />,
            ], [
                <label className={Classes.LABEL} key="modifierslabel">Modifiers</label>,
                this.renderSwitch("Disabled", showDisabled, this.toggleDisabled),
                this.renderSwitch("Read-only", showReadOnly, this.toggleReadOnly),
                this.renderSwitch("Left icon", showLeftIcon, this.toggleLeftIcon),
                this.renderSwitch("Placeholder text", showPlaceholder, this.togglePlaceholder),
            ],
        ];
    }

    protected renderExample() {
        return (
            <div>
                <NumericStepper
                    buttonPosition={BUTTON_POSITIONS[this.state.buttonPositionIndex].value}
                    intent={this.state.intent}

                    min={MIN_VALUES[this.state.minValueIndex].value}
                    max={MAX_VALUES[this.state.maxValueIndex].value}

                    stepSize={STEP_SIZES[this.state.stepSizeIndex].value}
                    majorStepSize={MAJOR_STEP_SIZES[this.state.majorStepSizeIndex].value}
                    minorStepSize={MINOR_STEP_SIZES[this.state.minorStepSizeIndex].value}

                    disabled={this.state.showDisabled}
                    readOnly={this.state.showReadOnly}
                    leftIconName={this.state.showLeftIcon ? SAMPLE_LEFT_ICON : null}
                    placeholder={this.state.showPlaceholder ? SAMPLE_PLACEHOLDER : null}

                    onUpdate={this.handleUpdate}
                    value={this.state.value}
                />
                <br />
                <div>
                    <strong>Value:</strong> <code>{this.state.value || "null"}</code>
                </div>
            </div>
        );
    }

    private renderSwitch(label: string, checked: boolean, onChange: React.FormEventHandler<HTMLElement>) {
       return (
            <Switch
                checked={checked}
                label={label}
                key={this.labelToKey(label)}
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
            <label className={Classes.LABEL} key={this.labelToKey(label)}>
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

    private labelToKey(label: string) {
        // e.g. "My Element Label" => "myelementlabel"
        return label.toLowerCase().replace(/\s/g, "");
    }

    private handleUpdate = (value: string) => {
        this.setState({ value });
    }
}
