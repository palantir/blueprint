/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Collapse, H5, Pre, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface ICollapseExampleState {
    isOpen: boolean;
    keepChildrenMounted: boolean;
}

export class CollapseExample extends React.PureComponent<IExampleProps, ICollapseExampleState> {
    public state: ICollapseExampleState = {
        isOpen: false,
        keepChildrenMounted: false,
    };

    private handleChildrenMountedChange = handleBooleanChange(keepChildrenMounted => {
        this.setState({ keepChildrenMounted });
    });

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Switch
                    checked={this.state.keepChildrenMounted}
                    label="Keep children mounted"
                    onChange={this.handleChildrenMountedChange}
                />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <div style={{ width: "100%", height: "100%", margin: 0 }}>
                    <Button onClick={this.handleClick}>{this.state.isOpen ? "Hide" : "Show"} build logs</Button>
                    <Collapse isOpen={this.state.isOpen} keepChildrenMounted={this.state.keepChildrenMounted}>
                        <Pre>
                            [11:53:30] Finished 'typescript-bundle-blueprint' after 769 ms
                            <br />
                            [11:53:30] Starting 'typescript-typings-blueprint'...
                            <br />
                            [11:53:30] Finished 'typescript-typings-blueprint' after 198 ms
                            <br />
                            [11:53:30] write ./blueprint.css
                            <br />
                            [11:53:30] Finished 'sass-compile-blueprint' after 2.84 s
                        </Pre>
                    </Collapse>
                </div>
            </Example>
        );
    }

    private handleClick = () => this.setState({ isOpen: !this.state.isOpen });
}
