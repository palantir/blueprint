/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { FileMenu } from "./common/fileMenu";

export class PopoverSizingExample extends BaseExample<{}> {
    protected className = "docs-popover-sizing-example";

    protected renderExample() {
        return (
            <div>
                <Popover content={<FileMenu />} inline={true} position={Position.BOTTOM_LEFT}>
                    <Button>Open...</Button>
                </Popover>
            </div>
        );
    }
}
