/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Navbar, Switch } from "@blueprintjs/core";
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
        const { alignRight } = this.state;
        return (
            <Navbar style={{ width: "100%" }}>
                <Navbar.Group>
                    <Navbar.Heading>Blueprint</Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align={alignRight ? "right" : "left"}>
                    <Button className="pt-minimal" iconName="home">
                        Home
                    </Button>
                    <Button className="pt-minimal" iconName="document">
                        Files
                    </Button>
                    <Navbar.Divider />
                    <Button className="pt-minimal" iconName="user" />
                    <Button className="pt-minimal" iconName="notifications" />
                    <Button className="pt-minimal" iconName="cog" />
                </Navbar.Group>
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
