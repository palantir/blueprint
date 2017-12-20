/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Intent, IPopoverProps, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export class PopoverMinimalExample extends BaseExample<{}> {
    protected className = "docs-popover-minimal-example";

    protected renderExample() {
        const menuContent = (
            <Menu>
                <MenuItem text="New" iconName="document" />
                <MenuItem text="Open" iconName="folder-shared" />
                <MenuItem text="Close" iconName="add-to-folder" />
            </Menu>
        );

        const baseProps: IPopoverProps = { content: menuContent, position: Position.BOTTOM_LEFT };

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
