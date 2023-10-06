/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { Button, Card, Classes, Elevation, H5, Label, Slider, Switch } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

export interface CardExampleState {
    compact: boolean;
    elevation: Elevation;
    interactive: boolean;
    selected: boolean;
}

export class CardExample extends React.PureComponent<ExampleProps, CardExampleState> {
    public state: CardExampleState = {
        compact: false,
        elevation: 0,
        interactive: false,
        selected: false,
    };

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Card {...this.state}>
                    <H5>Analytical applications</H5>
                    <p>
                        User interfaces that enable people to interact smoothly with data, ask better questions, and
                        make better decisions.
                    </p>
                    <Button text="Explore products" className={Classes.BUTTON} />
                </Card>
            </Example>
        );
    }

    private renderOptions = () => (
        <>
            <H5>Props</H5>
            <Switch checked={this.state.interactive} label="Interactive" onChange={this.handleInteractiveChange} />
            <Switch checked={this.state.compact} label="Compact" onChange={this.handleCompactChange} />
            <Switch checked={this.state.selected} label="Selected" onChange={this.handleSelectedChange} />
            <Label>
                Elevation
                <Slider
                    max={4}
                    showTrackFill={false}
                    value={this.state.elevation}
                    onChange={this.handleElevationChange}
                    handleHtmlProps={{ "aria-label": "card elevation" }}
                />
            </Label>
        </>
    );

    private handleElevationChange = (elevation: Elevation) => this.setState({ elevation });

    private handleInteractiveChange = () => this.setState({ interactive: !this.state.interactive });

    private handleCompactChange = () => this.setState({ compact: !this.state.compact });

    private handleSelectedChange = () => this.setState({ selected: !this.state.selected });
}
