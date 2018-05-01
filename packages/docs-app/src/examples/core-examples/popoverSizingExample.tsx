/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
import { FileMenu } from "./common/fileMenu";

export class PopoverSizingExample extends BaseExample<{}> {
    protected renderExample() {
        return (
            <div>
                <Popover
                    content={<FileMenu className="docs-popover-sizing-example" />}
                    position={Position.BOTTOM_LEFT}
                    usePortal={false}
                >
                    <Button>Open...</Button>
                </Popover>
            </div>
        );
    }
}
