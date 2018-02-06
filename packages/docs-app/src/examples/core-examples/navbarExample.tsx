/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";

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
                    <Button className="pt-minimal" icon="home" text="Home" />
                    <Button className="pt-minimal" icon="document" text="Files" />
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
