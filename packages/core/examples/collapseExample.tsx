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

import { Button, Collapse } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export class CollapseExample extends BaseExample<{ isOpen: boolean }> {
    public state = {
        isOpen: false,
    };

    protected renderExample() {
        return (
            <div>
                <Button onClick={this.handleClick}>{this.state.isOpen ? "Hide" : "Show"} build logs</Button>
                <Collapse isOpen={this.state.isOpen}>
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

    private handleClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };
}
