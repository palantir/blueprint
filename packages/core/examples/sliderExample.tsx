/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { Slider, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export interface ISliderExampleState {
    value1?: number;
    value2?: number;
    value3?: number;
    vertical?: boolean;
}

export class SliderExample extends BaseExample<ISliderExampleState> {
    public state: ISliderExampleState = {
        value1: 0,
        value2: 2.5,
        value3: 30,
        vertical: false,
    };

    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));

    protected renderExample() {
        const { vertical } = this.state;

        const rootClasses = classNames("docs-slider-example", {
            "docs-slider-example-vertical": vertical,
        });

        return (
            <div className={rootClasses}>
                <Slider
                    min={0}
                    max={10}
                    stepSize={0.1}
                    labelStepSize={10}
                    onChange={this.getChangeHandler("value2")}
                    value={this.state.value2}
                    vertical={vertical}
                />
                <Slider
                    min={0}
                    max={0.7}
                    stepSize={0.01}
                    labelStepSize={0.14}
                    onChange={this.getChangeHandler("value1")}
                    renderLabel={this.renderLabel1}
                    value={this.state.value1}
                    vertical={vertical}
                />
                <Slider
                    min={-12}
                    max={48}
                    stepSize={6}
                    labelStepSize={10}
                    onChange={this.getChangeHandler("value3")}
                    renderLabel={this.renderLabel3}
                    showTrackFill={false}
                    value={this.state.value3}
                    vertical={vertical}
                />
            </div>
        );
    }

    protected renderOptions() {
        return [
            [<Switch checked={this.state.vertical} label="Vertical" key="vertical" onChange={this.toggleVertical} />],
        ];
    }

    private getChangeHandler(key: string) {
        return (value: number) => this.setState({ [key]: value });
    }

    private renderLabel1(val: number) {
        return `${Math.round(val * 100)}%`;
    }

    private renderLabel3(val: number) {
        return val === 0 ? `£${val}` : `£${val},000`;
    }
}
