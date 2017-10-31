/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Card, Classes, Elevation, Slider, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export interface ICardExampleState {
    elevation?: Elevation;
    interactive?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
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
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <Button text="Submit" className={Classes.BUTTON} />
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

    private handleElevationChange = (elevation: number) => this.setState({ elevation });

    private handleInteractiveChange = () => this.setState({ interactive: !this.state.interactive });
}
