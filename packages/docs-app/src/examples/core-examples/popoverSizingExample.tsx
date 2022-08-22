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

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to Popover2 instead.
 */

/* eslint-disable deprecation/deprecation, @blueprintjs/no-deprecated-components */

import * as React from "react";

import { Button, Popover, Position } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

import { FileMenu } from "./common/fileMenu";

export class PopoverSizingExample extends React.PureComponent<ExampleProps> {
    public render() {
        return (
            <Example options={false} {...this.props}>
                <Popover content={<FileMenu className="docs-popover-sizing-example" />} position={Position.BOTTOM_LEFT}>
                    <Button>Open...</Button>
                </Popover>
            </Example>
        );
    }
}
