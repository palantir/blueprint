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
