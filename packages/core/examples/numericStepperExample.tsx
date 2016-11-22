/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import BaseExample, { handleNumberChange } from "./common/baseExample";
import {
    ButtonPosition,
    Classes,
    Intent,
    NumericStepper
} from "@blueprintjs/core";

const LABEL_FOR_NULL_VALUE = "None";
// const SAMPLE_LEFT_ICON = "variable";
// const SAMPLE_PLACEHOLDER_TEXT = "Enter a number...";

export interface INumericStepperExampleState {
    buttonPositionIndex?: number;
    intentIndex?: number;
    majorStepSizeIndex?: number;
    maxValueIndex?: number;
    minorStepSizeIndex?: number;
    minValueIndex?: number;

    showDisabled?: boolean;
    showLargeSize?: boolean;
    showLeftIcon?: boolean;
    showPlaceholderText?: boolean;
    showReadOnly?: boolean;

    stepSizeIndex?: number;

    // value?: string;
}

const MIN_VALUES = [
    null,
    -10,
    0,
    10,
];

const MAX_VALUES = [
    null,
    20,
    50,
    100,
];

const STEP_SIZES = [
    1,
    2,
];

const MINOR_STEP_SIZES = [
    null,
    0.1,
    0.2,
];

const MAJOR_STEP_SIZES = [
    null,
    10,
    20,
];

export class NumericStepperExample extends BaseExample<INumericStepperExampleState> {

    public state: INumericStepperExampleState = {
        buttonPositionIndex: 0,
        intentIndex: 0,
        majorStepSizeIndex: 0,
        maxValueIndex: 0,
        minValueIndex: 0,
        minorStepSizeIndex: 0,

        showDisabled: false,
        showLargeSize: false,
        showLeftIcon: false,
        showPlaceholderText: false,
        showReadOnly: false,

        stepSizeIndex: 0,
    };


    private handleMaxValueChange = handleNumberChange((maxValueIndex) => this.setState({ maxValueIndex }));
    private handleMinValueChange = handleNumberChange((minValueIndex) => this.setState({ minValueIndex }));
    private handleStepSizeChange = handleNumberChange((stepSizeIndex) => this.setState({ stepSizeIndex }));

    private handleMinorStepSizeChange = handleNumberChange((minorStepSizeIndex) => {
        this.setState({ minorStepSizeIndex });
    });

    private handleMajorStepSizeChange = handleNumberChange((majorStepSizeIndex) => {
        this.setState({ majorStepSizeIndex })
    });

    protected renderOptions() {
        const {
            // buttonPositionIndex,
            // intentIndex,
            majorStepSizeIndex,
            maxValueIndex,
            minValueIndex,
            minorStepSizeIndex,
            stepSizeIndex,
        } = this.state;

        return [
            [
                this.renderSelectMenu(
                    "Minimum value", minValueIndex, MIN_VALUES, this.handleMinValueChange),
                this.renderSelectMenu(
                    "Maximum value", maxValueIndex, MAX_VALUES, this.handleMaxValueChange),
                this.renderSelectMenu(
                    "Step size", stepSizeIndex, STEP_SIZES, this.handleStepSizeChange),
                this.renderSelectMenu(
                    "Minor step size", minorStepSizeIndex, MINOR_STEP_SIZES, this.handleMinorStepSizeChange),
                this.renderSelectMenu(
                    "Major step size", majorStepSizeIndex, MAJOR_STEP_SIZES, this.handleMajorStepSizeChange),
            ],
        ];
    }

    protected renderExample() {
        return (
            <NumericStepper
                min={MIN_VALUES[this.state.minValueIndex]}
                max={MAX_VALUES[this.state.maxValueIndex]}

                stepSize={STEP_SIZES[this.state.stepSizeIndex]}
                majorStepSize={MAJOR_STEP_SIZES[this.state.majorStepSizeIndex]}
                minorStepSize={MINOR_STEP_SIZES[this.state.minorStepSizeIndex]}
            />
        );

        // return (
        //     <div className="pt-numeric-stepper-example">
        //         <code>{"<NumericStepper />"}</code>
        //         <NumericStepper />
        //         <code>{"<NumericStepper buttonPosition='right' />"}</code>
        //         <NumericStepper buttonPosition="right" />
        //         <code>{"<NumericStepper buttonPosition='split' />"}</code>
        //         <NumericStepper buttonPosition="split" />
        //         <code>{"<NumericStepper buttonPosition='left' />"}</code>
        //         <NumericStepper buttonPosition="left" />
        //         <code>{"<NumericStepper buttonPosition='none' />"}</code>
        //         <NumericStepper buttonPosition="none" />
        //         <code>{"<NumericStepper intent={Intent.PRIMARY} />"}</code>
        //         <NumericStepper intent={Intent.PRIMARY} />
        //         <code>{"<NumericStepper intent={Intent.SUCCESS} />"}</code>
        //         <NumericStepper intent={Intent.SUCCESS} />
        //         <code>{"<NumericStepper intent={Intent.WARNING} />"}</code>
        //         <NumericStepper intent={Intent.WARNING} />
        //         <code>{"<NumericStepper intent={Intent.DANGER} />"}</code>
        //         <NumericStepper intent={Intent.DANGER} />
        //         <code>{"<NumericStepper intent={Intent.DANGER} leftIconName='variable' />"}</code>
        //         <NumericStepper intent={Intent.DANGER} leftIconName="variable" />
        //         <code>{"<NumericStepper placeholder='Enter a number...' />"}</code>
        //         <NumericStepper placeholder="Enter a number..." />
        //         <code>{"<NumericStepper value='10' />"}</code>
        //         <NumericStepper value="10" />
        //         <code>{"<NumericStepper value='10' disabled />"}</code>
        //         <NumericStepper value="10" disabled />
        //         <code>{"<NumericStepper value='10' readOnly />"}</code>
        //         <NumericStepper value="10" readOnly />
        //         <code>{"<NumericStepper min={4} />"}</code>
        //         <NumericStepper min={4} />
        //         <code>{"<NumericStepper max={4} />"}</code>
        //         <NumericStepper max={4} />
        //         <code>{"<NumericStepper min={0} max={10} />"}</code>
        //         <NumericStepper min={0} max={10} />
        //         <code>{"<NumericStepper min={0} max={100} stepSize={2} minorStepSize={0.2} majorStepSize={4} buttonPosition='split' />"}</code>
        //         <NumericStepper min={0} max={100} stepSize={2} minorStepSize={0.2} majorStepSize={4} buttonPosition="split" />
        //         <code>{"<NumericStepper value={4} />"}</code>
        //         <NumericStepper value={4} />
        //         <code>{"<NumericStepper value={'4'} />"}</code>
        //         <NumericStepper value={'4'} />
        //         <code>{"<NumericStepper onChange={console.log} />"}</code>
        //         <NumericStepper onChange={console.log} />
        //         <code>{"<NumericStepper placeholder={'Enter a number...'} />"}</code>
        //         <NumericStepper placeholder={"Enter a number..."} />
        //         <code>{"<NumericStepper leftIconName={'variable'} />"}</code>
        //         <NumericStepper leftIconName={"variable"} />
        //         <code>{"<NumericStepper minorStepSize={null} />"}</code>
        //         <NumericStepper minorStepSize={null} />
        //         <code>{"<NumericStepper majorStepSize={null} />"}</code>
        //         <NumericStepper majorStepSize={null} />
        //         <code>{"<NumericStepper minorStepSize={null} majorStepSize={null} />"}</code>
        //         <NumericStepper minorStepSize={null} majorStepSize={null} />
        //         <code>{"<NumericStepper onSubmit={this.onSubmit} /> (this example can do math!)"}</code>
        //         <NumericStepper onDone={this.onDone} value={this.state.value} />
        //     </div>
        // );
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

    private renderSelectMenuOptions(values: any[]) {
        return values.map((value, index) => {
            const label = (value == null) ? LABEL_FOR_NULL_VALUE : value;
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

    // private onDone = (value: string) => {
    //     console.log(value);
    //     const result = eval(value);
    //     this.setState({ value: result });
    // }
}
