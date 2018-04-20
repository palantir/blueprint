/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Intent, MultiRangeSlider, SliderHandle, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";

export interface IMultiRangeSliderExampleState {
    hideOuterBounds?: boolean;
    twoTailed?: boolean;
    values?: number[];
    vertical?: boolean;
}

interface IBoundValuesUpdate {
    [index: number]: number;
}

export class MultiRangeSliderExample extends BaseExample<IMultiRangeSliderExampleState> {
    public state: IMultiRangeSliderExampleState = {
        hideOuterBounds: false,
        twoTailed: true,
        values: [12, 36, 72, 90],
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
                    {this.renderOuterStartHandle()}
                    {this.renderInnerStartHandle()}
                    {this.renderInnerEndHandle()}
                    {this.renderOuterEndHandle()}
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
        return <SliderHandle trackIntentBefore={Intent.DANGER} type="start" value={values[0]} />;
    }

    private renderInnerStartHandle() {
        return <SliderHandle trackIntentBefore={Intent.WARNING} type="start" value={this.state.values[1]} />;
    }

    private renderInnerEndHandle() {
        const { twoTailed, values } = this.state;
        if (!twoTailed) {
            return null;
        }
        return <SliderHandle trackIntentAfter={Intent.WARNING} type="end" value={values[2]} />;
    }

    private renderOuterEndHandle() {
        const { hideOuterBounds, twoTailed, values } = this.state;
        if (hideOuterBounds || !twoTailed) {
            return null;
        }
        return <SliderHandle trackIntentAfter={Intent.DANGER} type="end" value={values[3]} />;
    }

    private handleChange = (newValues: number[]) => {
        const updatedValues = this.getUpdatedValues(newValues);
        const values = this.state.values.slice();
        for (let index = 0; index < 4; index++) {
            if (index in updatedValues) {
                values[index] = updatedValues[index];
            }
        }
        values.sort((a, b) => a - b);
        this.setState({ values });
    };

    private getUpdatedValues(values: number[]): IBoundValuesUpdate {
        const { hideOuterBounds, twoTailed } = this.state;
        if (hideOuterBounds) {
            if (twoTailed) {
                const [newInnerStart, newInnerEnd] = values;
                return {
                    [1]: newInnerStart,
                    [2]: newInnerEnd,
                };
            } else {
                const [newInnerStart] = values;
                return {
                    [1]: newInnerStart,
                };
            }
        } else {
            if (twoTailed) {
                return values;
            } else {
                const [newOuterStart, newInnerStart] = values;
                return {
                    [0]: newOuterStart,
                    [1]: newInnerStart,
                };
            }
        }
    }
}
