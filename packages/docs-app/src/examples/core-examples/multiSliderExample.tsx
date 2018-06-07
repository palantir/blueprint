/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import {
    H5,
    Intent,
    MultiSlider,
    Radio,
    RadioGroup,
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

type ShownIntents = "danger" | "warning" | "both";

interface IMultiSliderExampleState {
    interactionKind: SliderHandleInteractionKind;
    showTrackFill: boolean;
    shownIntents: ShownIntents;
    values: ISliderValues;
    vertical: boolean;
}

export class MultiSliderExample extends React.PureComponent<IExampleProps, IMultiSliderExampleState> {
    public state: IMultiSliderExampleState = {
        interactionKind: SliderHandleInteractionKind.PUSH,
        showTrackFill: true,
        shownIntents: "both",
        // tslint:disable:object-literal-sort-keys
        values: {
            dangerStart: 12,
            warningStart: 36,
            warningEnd: 72,
            dangerEnd: 90,
        },
        // tslint:enable:object-literal-sort-keys
        vertical: false,
    };

    private toggleTrackFill = handleBooleanChange(showTrackFill => this.setState({ showTrackFill }));
    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));
    private handleInteractionKindChange = handleStringChange((interactionKind: SliderHandleInteractionKind) =>
        this.setState({ interactionKind }),
    );
    private handleShownIntentsChange = handleStringChange((shownIntents: ShownIntents) =>
        this.setState({ shownIntents }),
    );

    public render() {
        const { interactionKind, shownIntents, values } = this.state;
        const showDanger = shownIntents !== "warning";
        const showWarning = shownIntents !== "danger";
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <MultiSlider
                    defaultTrackIntent={Intent.SUCCESS}
                    labelStepSize={20}
                    max={100}
                    min={0}
                    onChange={this.handleChange}
                    showTrackFill={this.state.showTrackFill}
                    stepSize={2}
                    vertical={this.state.vertical}
                >
                    {/* up to four handles, toggle-able in pairs */}
                    {showDanger && (
                        <SliderHandle
                            type="start"
                            value={values.dangerStart}
                            intentBefore="danger"
                            interactionKind={interactionKind}
                        />
                    )}
                    {showWarning && (
                        <SliderHandle
                            type="start"
                            value={values.warningStart}
                            intentBefore="warning"
                            interactionKind={interactionKind}
                        />
                    )}
                    {showWarning && (
                        <SliderHandle
                            type="end"
                            value={values.warningEnd}
                            intentAfter="warning"
                            interactionKind={interactionKind}
                        />
                    )}
                    {showDanger && (
                        <SliderHandle
                            type="end"
                            value={values.dangerEnd}
                            intentAfter="danger"
                            interactionKind={interactionKind}
                        />
                    )}
                </MultiSlider>
            </Example>
        );
    }

    private renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch checked={this.state.vertical} label="Vertical" onChange={this.toggleVertical} />
                <Switch checked={this.state.showTrackFill} label="Show track fill" onChange={this.toggleTrackFill} />
                <H5>Handle interaction</H5>
                <RadioGroup selectedValue={this.state.interactionKind} onChange={this.handleInteractionKindChange}>
                    <Radio label="Lock" value={SliderHandleInteractionKind.LOCK} />
                    <Radio label="Push" value={SliderHandleInteractionKind.PUSH} />
                </RadioGroup>
                <H5>Example</H5>
                <RadioGroup selectedValue={this.state.shownIntents} onChange={this.handleShownIntentsChange}>
                    <Radio label="Outer handles" value="danger" />
                    <Radio label="Inner handles" value="warning" />
                    <Radio label="Both pairs" value="both" />
                </RadioGroup>
            </>
        );
    }

    private handleChange = (newValues: number[]) => {
        // newValues is always in sorted order, and handled cannot be unsorted by dragging with lock/push interactions.
        const [dangerStart, warningStart, warningEnd, dangerEnd] = newValues;
        this.setState({ values: { dangerStart, warningStart, warningEnd, dangerEnd } });
    };
}
