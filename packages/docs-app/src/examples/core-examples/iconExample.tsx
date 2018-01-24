/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, Icon, IconName, InputGroup, Slider } from "@blueprintjs/core";
import { BaseExample, handleStringChange } from "@blueprintjs/docs-theme";

export interface IIconExampleState {
    iconName: IconName;
    iconSize: number;
}

export class IconExample extends BaseExample<IIconExampleState> {
    public state: IIconExampleState = {
        iconName: "calendar",
        iconSize: Icon.SIZE_STANDARD,
    };

    protected renderExample() {
        return <Icon {...this.state} />;
    }

    protected renderOptions() {
        return [
            [
                <label className={Classes.LABEL} key="visible-label">
                    Icon size
                </label>,
                <Slider
                    key="visible"
                    labelStepSize={20}
                    min={0}
                    max={100}
                    showTrackFill={false}
                    value={this.state.iconSize}
                    onChange={this.handleIconSizeChange}
                />,
                <InputGroup placeholder="Icon name" value={this.state.iconName} onChange={this.handleIconNameChange} />,
            ],
        ];
    }

    private handleIconSizeChange = (iconSize: number) => this.setState({ iconSize });

    // tslint:disable-next-line:member-ordering
    private handleIconNameChange = handleStringChange((iconName: IconName) => this.setState({ iconName }));
}
