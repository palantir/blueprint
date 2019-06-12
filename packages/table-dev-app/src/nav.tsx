/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Alignment, AnchorButton, Classes, Navbar, Switch } from "@blueprintjs/core";

export interface INavProps {
    selected: "index" | "features";
}

export class Nav extends React.PureComponent<INavProps> {
    public render() {
        const darkThemeToggleStyles = { marginBottom: 0 };
        const isIndex = this.props.selected === "index";

        return (
            <Navbar className={Classes.DARK} fixedToTop={true}>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>Blueprint Table</Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <AnchorButton active={isIndex} href="index.html" minimal={true} text="Home" />
                    <Navbar.Divider />
                    <AnchorButton active={!isIndex} href="features.html" minimal={true} text="Features (Legacy)" />
                    <Navbar.Divider />
                    <Switch style={darkThemeToggleStyles} label="Dark theme" onChange={this.handleToggleDarkTheme} />
                </Navbar.Group>
            </Navbar>
        );
    }

    private handleToggleDarkTheme() {
        document.body.classList.toggle(Classes.DARK);
    }
}
