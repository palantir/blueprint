/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export interface INavbarExampleState {
    alignRight?: boolean;
}

export class NavbarExample extends BaseExample<INavbarExampleState> {
    public state: INavbarExampleState = {
        alignRight: false,
    };

    private handleAlignRightChange = handleBooleanChange(alignRight => this.setState({ alignRight }));

    protected renderExample() {
        return (
            <Navbar>
                <NavbarGroup align={this.state.alignRight ? "right" : "left"}>
                    <NavbarHeading>Blueprint</NavbarHeading>
                    <NavbarDivider />
                    <button className="pt-button pt-minimal pt-icon-home">Home</button>
                    <button className="pt-button pt-minimal pt-icon-document">Files</button>
                </NavbarGroup>
            </Navbar>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.alignRight}
                    key="align-right"
                    label="Align right"
                    onChange={this.handleAlignRightChange}
                />,
            ],
        ];
    }
}
