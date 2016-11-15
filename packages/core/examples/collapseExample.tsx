/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import { Button, Collapse } from "@blueprintjs/core";
import BaseExample from "./common/baseExample";

export class CollapseExample extends BaseExample<{ isOpen: boolean }> {
    public state = {
        isOpen: false,
    };

    protected renderExample() {
        return (
            <div>
                <Button onClick={this.handleClick}>
                    {this.state.isOpen ? "Hide" : "Show"} build logs
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                    <pre>
                        [11:53:30] Finished 'typescript-bundle-blueprint' after 769 ms<br/>
                        [11:53:30] Starting 'typescript-typings-blueprint'...<br/>
                        [11:53:30] Finished 'typescript-typings-blueprint' after 198 ms<br/>
                        [11:53:30] write ./blueprint.css<br/>
                        [11:53:30] Finished 'sass-compile-blueprint' after 2.84 s
                    </pre>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
}
