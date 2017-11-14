/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Collapse, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export interface ICollapseExampleState {
    isOpen?: boolean;
    keepChildrenMounted?: boolean;
}

export class CollapseExample extends BaseExample<ICollapseExampleState> {
    public state: ICollapseExampleState = {
        isOpen: false,
        keepChildrenMounted: false,
    };

    private handleChildrenMountedChange = handleBooleanChange(keepChildrenMounted => {
        this.setState({ keepChildrenMounted });
    });

    protected renderExample() {
        return (
            <div>
                <Button onClick={this.handleClick}>{this.state.isOpen ? "Hide" : "Show"} build logs</Button>
                <Collapse isOpen={this.state.isOpen} keepChildrenMounted={this.state.keepChildrenMounted}>
                    <pre>
                        [11:53:30] Finished 'typescript-bundle-blueprint' after 769 ms<br />
                        [11:53:30] Starting 'typescript-typings-blueprint'...<br />
                        [11:53:30] Finished 'typescript-typings-blueprint' after 198 ms<br />
                        [11:53:30] write ./blueprint.css<br />
                        [11:53:30] Finished 'sass-compile-blueprint' after 2.84 s
                    </pre>
                </Collapse>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.keepChildrenMounted}
                    key="keepChildrenMounted"
                    label="Keep children mounted"
                    onChange={this.handleChildrenMountedChange}
                />,
            ],
        ];
    }

    private handleClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };
}
