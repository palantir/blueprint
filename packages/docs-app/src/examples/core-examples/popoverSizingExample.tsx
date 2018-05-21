/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Popover, Position } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { FileMenu } from "./common/fileMenu";

export class PopoverSizingExample extends React.PureComponent<IExampleProps> {
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
