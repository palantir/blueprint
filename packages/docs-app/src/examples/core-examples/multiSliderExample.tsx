/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * 
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import {
    Classes,
    Intent,
    Label,
    MultiSlider,
    SliderHandle,
    SliderHandleInteractionKind,
    Switch,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

interface ISliderValues {
    dangerStart: number;
    warningStart: number;
    warningEnd: number;
    dangerEnd: number;
}

type HandleIntent = "danger" | "warning";
type HandleTail = "lower" | "upper";
type HandleKey = [HandleIntent, HandleTail];

type ShownIntents = HandleIntent | "both";
type ShownTails = HandleTail | "both" | "neither";

interface IMultiSliderExampleState {
    lockHandles: boolean;
    shownIntents: ShownIntents;
    shownTails: ShownTails;
    values?: ISliderValues;
    vertical?: boolean;
}

const SLIDER_HANDLE_KEYS: HandleKey[] = [
    ["danger", "lower"],
    ["warning", "lower"],
    ["warning", "upper"],
    ["danger", "upper"],
];

// tslint:disable:object-literal-sort-keys
export class MultiSliderExample extends React.PureComponent<IExampleProps, IMultiSliderExampleState> {
    public state: IMultiSliderExampleState = {
        lockHandles: false,
        shownIntents: "both",
        shownTails: "both",
        values: {
            dangerStart: 12,
            warningStart: 36,
            warningEnd: 72,
            dangerEnd: 90,
        },
        vertical: false,
    };

    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));
    private toggleLockHandles = handleBooleanChange(lockHandles => this.setState({ lockHandles }));
    private handleShownIntentsChange = handleStringChange((shownIntents: ShownIntents) =>
        this.setState({ shownIntents }),
    );
    private handleShownTailsChange = handleStringChange((shownTails: ShownTails) => this.setState({ shownTails }));

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <MultiSlider
                    min={0}
                    max={100}
                    stepSize={2}
                    labelStepSize={20}
                    onChange={this.handleChange}
                    vertical={this.state.vertical}
                    defaultTrackIntent={Intent.SUCCESS}
                >
                    {SLIDER_HANDLE_KEYS.filter(this.isHandleShown).map(this.renderHandle)}
                </MultiSlider>
            </Example>
        );
    }

    private renderHandle = (key: HandleKey) => {
        const [handleIntent, handleTail] = key;
        const { lockHandles, values } = this.state;
        const intent = handleIntent === "danger" ? Intent.NONE : Intent.NONE;
        return (
            <SliderHandle
                key={`${handleIntent}-${handleTail}`}
                type={handleTail === "lower" ? "start" : "end"}
                value={values[getHandleValueKey(key)]}
                intentBefore={handleTail === "lower" ? intent : undefined}
                intentAfter={handleTail === "upper" ? intent : undefined}
                interactionKind={lockHandles ? SliderHandleInteractionKind.LOCK : SliderHandleInteractionKind.PUSH}
            />
        );
    };

    private isHandleShown = ([handleIntent, handleTail]: HandleKey) => {
        const { shownIntents, shownTails } = this.state;
        return (
            (shownTails === "both" || shownTails === handleTail) &&
            (shownIntents === "both" || shownIntents === handleIntent)
        );
    };

    private renderOptions() {
        return (
            <>
                <Switch checked={this.state.vertical} label="Vertical" onChange={this.toggleVertical} />
                <Switch checked={this.state.lockHandles} label="Lock handles" onChange={this.toggleLockHandles} />
                <Label text="Intent">
                    <div className={Classes.SELECT}>
                        <select value={this.state.shownIntents} onChange={this.handleShownIntentsChange}>
                            <option value="both">Both</option>
                            <option value="warning">Warning</option>
                            <option value="danger">Danger</option>
                        </select>
                    </div>
                </Label>
                <Label text="Tail">
                    <div className={Classes.SELECT}>
                        <select value={this.state.shownTails} onChange={this.handleShownTailsChange}>
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
        const valuesMap = this.getUpdatedValues(newValues);
        const values = Object.keys(valuesMap).map((key: keyof ISliderValues) => valuesMap[key]);
        values.sort((a, b) => a - b);
        const [dangerStart, warningStart, warningEnd, dangerEnd] = values;
        this.setState({ values: { dangerStart, warningStart, warningEnd, dangerEnd } });
    };

    private getUpdatedValues(newValues: number[]) {
        const updatedValuesMap: Partial<ISliderValues> = {};
        const handleKeys = SLIDER_HANDLE_KEYS.filter(this.isHandleShown);
        handleKeys.forEach((key, index) => {
            updatedValuesMap[getHandleValueKey(key)] = newValues[index];
        });
        return { ...this.state.values, ...updatedValuesMap };
    }
}

function getHandleValueKey([handleIntent, handleTail]: HandleKey): keyof ISliderValues {
    if (handleIntent === "danger") {
        return handleTail === "lower" ? "dangerStart" : "dangerEnd";
    } else {
        return handleTail === "lower" ? "warningStart" : "warningEnd";
    }
}
