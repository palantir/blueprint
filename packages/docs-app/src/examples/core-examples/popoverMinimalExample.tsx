/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Intent, IPopoverProps, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { FileMenu } from "./common/fileMenu";

export class PopoverMinimalExample extends BaseExample<{}> {
    protected className = "docs-popover-minimal-example";

    protected renderExample() {
        const baseProps: IPopoverProps = { content: <FileMenu />, position: Position.BOTTOM_LEFT };

        return (
            <div>
                <Popover {...baseProps}>
                    <Button>Default</Button>
                </Popover>
                <Popover {...baseProps} minimal={true}>
                    <Button intent={Intent.PRIMARY}>Minimal</Button>
                </Popover>
            </div>
        );
    }
}
