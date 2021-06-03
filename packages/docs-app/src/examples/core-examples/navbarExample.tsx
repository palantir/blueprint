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

import React from "react";

import {
    Alignment,
    Button,
    Classes,
    H5,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
} from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { AlignmentSelect } from "./common/alignmentSelect";

export interface NavbarExampleState {
    alignment: Alignment;
}

export class NavbarExample extends React.PureComponent<ExampleProps, NavbarExampleState> {
    public state: NavbarExampleState = {
        alignment: Alignment.LEFT
    };

    private handleAlignChange = (alignment: Alignment) => this.setState({ alignment });

    public render() {
        const { alignment, showRightGroup } = this.state;
        const options = (
            <>
                <H5>Props</H5>
                <AlignmentSelect label="Alignment" align={this.state.alignment} onChange={this.handleAlignChange} />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <Navbar>
                    <NavbarGroup align={Alignment.RIGHT}>
                        <NavbarHeading>Blueprint</NavbarHeading>
                    </NavbarGroup>
                    <NavbarGroup align={alignment}>
                        <Button className={Classes.MINIMAL} icon="home" text="Home" />
                        <NavbarDivider />
                        <Button className={Classes.MINIMAL} icon="document" text="Files" />
                    </NavbarGroup>
                    <NavbarGroup align={Alignment.RIGHT}>
                        <Button className={Classes.MINIMAL} icon="cog" />
                    </NavbarGroup>
                </Navbar>
            </Example>
        );
    }
}
