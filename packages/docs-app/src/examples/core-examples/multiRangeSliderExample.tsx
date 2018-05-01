/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Intent, MultiRangeSlider, SliderHandle, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";

export interface ISliderValues {
    outerStart: number;
    innerStart: number;
    innerEnd: number;
    outerEnd: number;
}

export interface IMultiRangeSliderExampleState {
    hideOuterBounds?: boolean;
    twoTailed?: boolean;
    values?: ISliderValues;
    vertical?: boolean;
}

// tslint:disable:object-literal-sort-keys
export class MultiRangeSliderExample extends BaseExample<IMultiRangeSliderExampleState> {
    public state: IMultiRangeSliderExampleState = {
        hideOuterBounds: false,
        twoTailed: true,
        values: {
            outerStart: 12,
            innerStart: 36,
            innerEnd: 72,
            outerEnd: 90,
        },
        vertical: false,
    };

    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));
    private toggleHideOuterBounds = handleBooleanChange(hideOuterBounds => this.setState({ hideOuterBounds }));
    private toggleTwoTailed = handleBooleanChange(twoTailed => this.setState({ twoTailed }));

    protected renderExample() {
        return (
            <div style={{ width: "100%" }}>
                <MultiRangeSlider
                    min={0}
                    max={100}
                    stepSize={2}
                    labelStepSize={20}
                    onChange={this.handleChange}
                    vertical={this.state.vertical}
                    defaultTrackIntent={Intent.SUCCESS}
                >
                    {this.renderInnerEndHandle()}
                    {this.renderOuterEndHandle()}
                    {this.renderOuterStartHandle()}
                    {this.renderInnerStartHandle()}
                </MultiRangeSlider>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch checked={this.state.vertical} label="Vertical" key="vertical" onChange={this.toggleVertical} />,
                <Switch
                    checked={this.state.hideOuterBounds}
                    label="Hide outer bounds"
                    key="hide-outer"
                    onChange={this.toggleHideOuterBounds}
                />,
                <Switch
                    checked={this.state.twoTailed}
                    label="Two tailed bounds"
                    key="two-tailed"
                    onChange={this.toggleTwoTailed}
                />,
            ],
        ];
    }

    private renderOuterStartHandle() {
        const { hideOuterBounds, values } = this.state;
        if (hideOuterBounds) {
            return null;
        }
        return <SliderHandle trackIntentBefore={Intent.DANGER} type="start" value={values.outerStart} />;
    }

    private renderInnerStartHandle() {
        return <SliderHandle trackIntentBefore={Intent.WARNING} type="start" value={this.state.values.innerStart} />;
    }

    private renderInnerEndHandle() {
        const { twoTailed, values } = this.state;
        if (!twoTailed) {
            return null;
        }
        return <SliderHandle trackIntentAfter={Intent.WARNING} type="end" value={values.innerEnd} />;
    }

    private renderOuterEndHandle() {
        const { hideOuterBounds, twoTailed, values } = this.state;
        if (hideOuterBounds || !twoTailed) {
            return null;
        }
        return <SliderHandle trackIntentAfter={Intent.DANGER} type="end" value={values.outerEnd} />;
    }

    private handleChange = (newValues: number[]) => {
        const updatedValues = this.getUpdatedValues(newValues);
        const values = { ...this.state.values, ...updatedValues };
        this.setState({ values });
    };

    private getUpdatedValues(values: number[]): Partial<ISliderValues> {
        const { hideOuterBounds, twoTailed } = this.state;
        if (hideOuterBounds) {
            if (twoTailed) {
                const [innerStart, innerEnd] = values;
                return { innerStart, innerEnd };
            } else {
                const [innerStart] = values;
                return { innerStart };
            }
        } else {
            if (twoTailed) {
                const [outerStart, innerStart, innerEnd, outerEnd] = values;
                return { outerStart, innerStart, innerEnd, outerEnd };
            } else {
                const [outerStart, outerEnd] = values;
                return { outerStart, outerEnd };
            }
        }
    }
}
