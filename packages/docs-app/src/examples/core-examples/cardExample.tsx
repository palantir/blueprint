/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Card, Classes, Elevation, H5, Label, Slider, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export interface ICardExampleState {
    elevation: Elevation;
    interactive: boolean;
}

export class CardExample extends React.PureComponent<IExampleProps, ICardExampleState> {
    public state: ICardExampleState = {
        elevation: 0,
        interactive: false,
    };

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={this.state.interactive} label="Interactive" onChange={this.handleInteractiveChange} />
                <Label>
                    Elevation
                    <Slider
                        max={4}
                        showTrackFill={false}
                        value={this.state.elevation}
                        onChange={this.handleElevationChange}
                    />
                </Label>
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <Card {...this.state}>
                    <H5>
                        <a href="#">Analytical applications</a>
                    </H5>
                    <p>
                        User interfaces that enable people to interact smoothly with data, ask better questions, and
                        make better decisions.
                    </p>
                    <Button text="Explore products" className={Classes.BUTTON} />
                </Card>
            </Example>
        );
    }

    private handleElevationChange = (elevation: Elevation) => this.setState({ elevation });
    private handleInteractiveChange = () => this.setState({ interactive: !this.state.interactive });
}
