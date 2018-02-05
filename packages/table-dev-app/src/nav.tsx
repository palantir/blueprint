/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { AnchorButton, Classes, Navbar, Switch } from "@blueprintjs/core";

export interface INavProps {
    selected?: string;
}

export class Nav extends React.Component<INavProps, {}> {
    public render() {
        const darkThemeToggleStyles = {
            marginBottom: 0,
            marginTop: "3px",
        };

        return (
            <Navbar className="pt-dark pt-fixed-top">
                <Navbar.Group align="left">
                    <Navbar.Heading>Blueprint Table</Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align="right">
                    <AnchorButton className={Classes.MINIMAL} href="index.html" text="Home" />
                    <AnchorButton className={Classes.MINIMAL} href="features.html" text="Features (Legacy)" />
                    <Navbar.Divider />
                    <Switch style={darkThemeToggleStyles} label="Dark theme" onChange={this.handleToggleDarkTheme} />
                </Navbar.Group>
            </Navbar>
        );
    }

    private handleToggleDarkTheme() {
        document.body.classList.toggle("pt-dark");
    }
}
