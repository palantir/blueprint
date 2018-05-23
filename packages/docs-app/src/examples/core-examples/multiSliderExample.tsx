/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * 
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, Intent, ISliderHandleProps, Label, MultiRangeSlider, SliderHandle, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

interface ISliderValues {
    dangerStart: number;
    warningStart: number;
    warningEnd: number;
    dangerEnd: number;
}

type IntentOption = "danger" | "warning" | "both";
type TailOption = "lower" | "upper" | "both" | "neither";

interface IMultiSliderExampleState {
    intent: IntentOption;
    tail: TailOption;
    values?: ISliderValues;
    vertical?: boolean;
}

export type ConcreteHandleProps = Pick<ISliderHandleProps, "trackIntentBefore" | "trackIntentAfter">;

// tslint:disable:object-literal-sort-keys
export abstract class AbstractMultiSliderExample extends React.PureComponent<IExampleProps, IMultiSliderExampleState> {
    public state: IMultiSliderExampleState = {
        intent: "both",
        tail: "both",
        values: {
            dangerStart: 12,
            warningStart: 36,
            warningEnd: 72,
            dangerEnd: 90,
        },
        vertical: false,
    };

    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));
    private handleIntentChange = handleStringChange((intent: IntentOption) => this.setState({ intent }));
    private handleTailChange = handleStringChange((tail: TailOption) => this.setState({ tail }));

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <MultiRangeSlider
                    min={0}
                    max={100}
                    stepSize={2}
                    labelStepSize={20}
                    onChange={this.handleChange}
                    vertical={this.state.vertical}
                    defaultTrackIntent={this.getDefaultTrackIntent()}
                >
                    {this.renderDangerStartHandle()}
                    {this.renderWarningStartHandle()}
                    {this.renderWarningEndHandle()}
                    {this.renderDangerEndHandle()}
                </MultiRangeSlider>
            </Example>
        );
    }

    protected abstract getDefaultTrackIntent(): Intent;
    protected abstract getDangerStartHandleProps(): ConcreteHandleProps;
    protected abstract getWarningStartHandleProps(): ConcreteHandleProps;
    protected abstract getWarningEndHandleProps(): ConcreteHandleProps;
    protected abstract getDangerEndHandleProps(): ConcreteHandleProps;

    private renderDangerStartHandle() {
        const { intent, tail, values } = this.state;
        if (intent === "warning" || tail === "upper" || tail === "neither") {
            return null;
        }
        return (
            <SliderHandle
                key="danger-start"
                type="start"
                value={values.dangerStart}
                {...this.getDangerStartHandleProps()}
            />
        );
    }

    private renderWarningStartHandle() {
        const { intent, tail, values } = this.state;
        if (intent === "danger" || tail === "upper" || tail === "neither") {
            return null;
        }
        return (
            <SliderHandle
                key="warning-start"
                type="start"
                value={values.warningStart}
                {...this.getWarningStartHandleProps()}
            />
        );
    }

    private renderWarningEndHandle() {
        const { intent, tail, values } = this.state;
        if (intent === "danger" || tail === "lower" || tail === "neither") {
            return null;
        }
        return (
            <SliderHandle key="warning-end" type="end" value={values.warningEnd} {...this.getWarningEndHandleProps()} />
        );
    }

    private renderDangerEndHandle() {
        const { intent, tail, values } = this.state;
        if (intent === "warning" || tail === "lower" || tail === "neither") {
            return null;
        }
        return (
            <SliderHandle key="danger-end" type="end" value={values.dangerEnd} {...this.getDangerEndHandleProps()} />
        );
    }

    private renderOptions() {
        return (
            <>
                <Switch checked={this.state.vertical} label="Vertical" onChange={this.toggleVertical} />
                <Label text="Intent">
                    <div className={Classes.SELECT}>
                        <select value={this.state.intent} onChange={this.handleIntentChange}>
                            <option value="both">Both</option>
                            <option value="warning">Warning</option>
                            <option value="danger">Danger</option>
                        </select>
                    </div>
                </Label>
                <Label text="Tail">
                    <div className={Classes.SELECT}>
                        <select value={this.state.tail} onChange={this.handleTailChange}>
                            <option value="both">Both</option>
                            <option value="lower">Lower</option>
                            <option value="upper">Upper</option>
                            <option value="neither">Neither</option>
                        </select>
                    </div>
                </Label>
            </>
        );
    }

    private handleChange = (newValues: number[]) => {
        const updatedValues = this.getUpdatedValues(newValues);
        const valuesMap = { ...this.state.values, ...updatedValues };
        const values = Object.keys(valuesMap).map((key: keyof ISliderValues) => valuesMap[key]);
        values.sort((a, b) => a - b);
        const [dangerStart, warningStart, warningEnd, dangerEnd] = values;
        this.setState({ values: { dangerStart, warningStart, warningEnd, dangerEnd } });
    };

    private getUpdatedValues(values: number[]): Partial<ISliderValues> {
        const { intent, tail } = this.state;
        if (tail === "neither") {
            return {};
        }
        switch (intent) {
            case "both": {
                switch (tail) {
                    case "both": {
                        const [dangerStart, warningStart, warningEnd, dangerEnd] = values;
                        return { dangerStart, warningStart, warningEnd, dangerEnd };
                    }
                    case "lower": {
                        const [dangerStart, warningStart] = values;
                        return { dangerStart, warningStart };
                    }
                    case "upper": {
                        const [warningEnd, dangerEnd] = values;
                        return { warningEnd, dangerEnd };
                    }
                }
                break;
            }
            case "danger": {
                switch (tail) {
                    case "both": {
                        const [dangerStart, dangerEnd] = values;
                        return { dangerStart, dangerEnd };
                    }
                    case "lower": {
                        const [dangerStart] = values;
                        return { dangerStart };
                    }
                    case "upper": {
                        const [dangerEnd] = values;
                        return { dangerEnd };
                    }
                }
                break;
            }
            case "warning": {
                switch (tail) {
                    case "both": {
                        const [warningStart, warningEnd] = values;
                        return { warningStart, warningEnd };
                    }
                    case "lower": {
                        const [warningStart] = values;
                        return { warningStart };
                    }
                    case "upper": {
                        const [warningEnd] = values;
                        return { warningEnd };
                    }
                }
            }
        }
        return {};
    }
}
