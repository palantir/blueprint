/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import {
    Alignment,
    Button,
    Classes,
    H5,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Switch,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface INavbarExampleState {
    alignRight: boolean;
}

export class NavbarExample extends React.PureComponent<IExampleProps, INavbarExampleState> {
    public state: INavbarExampleState = {
        alignRight: false,
    };

    private handleAlignRightChange = handleBooleanChange(alignRight => this.setState({ alignRight }));

    public render() {
        const { alignRight } = this.state;
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={alignRight} label="Align right" onChange={this.handleAlignRightChange} />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <Navbar>
                    <NavbarGroup align={alignRight ? Alignment.RIGHT : Alignment.LEFT}>
                        <NavbarHeading>Blueprint</NavbarHeading>
                        <NavbarDivider />
                        <Button className={Classes.MINIMAL} icon="home" text="Home" />
                        <Button className={Classes.MINIMAL} icon="document" text="Files" />
                    </NavbarGroup>
                </Navbar>
            </Example>
        );
    }
}
