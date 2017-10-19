/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Card, Classes, ElevetaionSize, Slider, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export interface ICardExampleState {
    elevation: ElevetaionSize;
    interactive: boolean;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export class CardExample extends BaseExample<ICardExampleState> {
    public state: ICardExampleState = {
        elevation: 0,
        interactive: false,
        onClick: null,
    };

    protected renderExample() {
        return (
            <Card {...this.state}>
                <h5>
                    <a href="#">Card heading</a>
                </h5>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis Fusce dapibus
                    mollis. Quisque eget ex diam.
                </p>
                <button type="button" className={Classes.BUTTON}>
                    Submit
                </button>
            </Card>
        );
    }

    protected renderOptions() {
        return [
            [
                <label className={Classes.LABEL} key="visible-label">
                    Elevation
                </label>,
                <Slider
                    key="visible"
                    max={4}
                    showTrackFill={false}
                    value={this.state.elevation}
                    onChange={this.handleElevationChange}
                />,
            ],
            [
                <Switch
                    checked={this.state.interactive}
                    key="interactive"
                    label="Interactive"
                    onChange={this.handleInteractiveChange}
                />,
            ],
        ];
    }

    private handleElevationChange = (elevation: number) => this.updateState({ elevation });

    private handleInteractiveChange = () => this.updateState({ interactive: !this.state.interactive });

    private updateState(state: Partial<ICardExampleState>) {
        return this.setState({ ...this.state, ...state });
    }
}
