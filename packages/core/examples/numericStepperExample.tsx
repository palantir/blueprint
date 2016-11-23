/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";
import {
    Classes,
    Intent,
    NumericStepper,
    NumericStepperButtonPosition,
    Switch,
} from "@blueprintjs/core";

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

const MIN_VALUES = [
    { label: "None", value: null },
    { label: "-10", value: -10 },
    { label: "0", value: 0 },
    { label: "10", value: 10 },
];

const MAX_VALUES = [
    { label: "None", value: null },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
];

const STEP_SIZES = [
    { label: "1", value: 1 },
    { label: "1", value: 2 },
];

const MINOR_STEP_SIZES = [
    { label: "None", value: null },
    { label: "0.1", value: 0.1 },
    { label: "0.2", value: 0.2 },
];

const MAJOR_STEP_SIZES = [
    { label: "None", value: null },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
];

const BUTTON_POSITIONS = [
    { label: "None", value: null },
    { label: "Left", value: NumericStepperButtonPosition.LEFT },
    { label: "Right", value: NumericStepperButtonPosition.RIGHT },
    { label: "Split", value: NumericStepperButtonPosition.SPLIT },
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
        return [
            [
                this.renderMinValueMenu(),
                this.renderMaxValueMenu(),
            ], [
                this.renderButtonPositionMenu(),
                this.renderIntentMenu(),
            ], [
                <label className={Classes.LABEL} key="modifierslabel">Modifiers</label>,
                this.renderDisabledSwitch(),
                this.renderReadOnlySwitch(),
                this.renderLeftIconSwitch(),
                this.renderPlaceholderSwitch(),
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
                    leftIconName={this.state.showLeftIcon ? SAMPLE_LEFT_ICON : null }
                    placeholder={this.state.showPlaceholder ? SAMPLE_PLACEHOLDER : null }

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

    private renderMinValueMenu() {
        const { minValueIndex } = this.state;
        return this.renderSelectMenu("Minimum value", minValueIndex, MIN_VALUES, this.handleMinValueChange);
    }

    private renderMaxValueMenu() {
        const { maxValueIndex } = this.state;
        return this.renderSelectMenu("Maximum value", maxValueIndex, MAX_VALUES, this.handleMaxValueChange);
    }

    private renderButtonPositionMenu() {
        const { buttonPositionIndex } = this.state;
        return this.renderSelectMenu(
            "Button position", buttonPositionIndex, BUTTON_POSITIONS, this.handleButtonPositionChange);
    }

    private renderIntentMenu() {
        return <IntentSelect intent={this.state.intent} key="intent" onChange={this.handleIntentChange} />;
    }

    private renderDisabledSwitch() {
        return this.renderSwitch("Disabled", this.state.showDisabled, this.toggleDisabled);
    }

    private renderReadOnlySwitch() {
        return this.renderSwitch("Read-only", this.state.showReadOnly, this.toggleReadOnly);
    }

    private renderLeftIconSwitch() {
        return this.renderSwitch("Left icon", this.state.showLeftIcon, this.toggleLeftIcon);
    }

    private renderPlaceholderSwitch() {
        return this.renderSwitch("Placeholder text", this.state.showPlaceholder, this.togglePlaceholder);
    }

    private renderSwitch(label: string, checked: boolean, onChange: React.FormEventHandler<HTMLElement>) {
       const key = this.labelToKey(label);
       return (
            <Switch
                checked={checked}
                label={label}
                key={key}
                onChange={onChange}
            />
        );
    }

    private renderSelectMenu(
        label: string,
        selectedValue: number | string,
        options: any[],
        onChange: React.FormEventHandler<HTMLElement>
    ) {
        const key = this.labelToKey(label);
        return (
            <label className={Classes.LABEL} key={key}>
                {label}
                <div className={Classes.SELECT}>
                    <select value={selectedValue} onChange={onChange}>
                        {this.renderSelectMenuOptions(options)}
                    </select>
                </div>
            </label>
        );
    }

    private renderSelectMenuOptions(options: any[]) {
        return options.map(({ label }, index) => {
            return <option key={index} value={index}>{label}</option>;
        });
    }

    private labelToKey(label: string) {
        return label
            .split(" ")
                .map((token) => token.toLowerCase())
                .join("")
            .split("-")
                .join("");
    }

    private handleUpdate = (value: string) => {
        this.setState({ value });
    }
}
