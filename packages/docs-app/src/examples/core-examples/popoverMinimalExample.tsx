/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Intent, IPopoverProps, Popover, Position } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { FileMenu } from "./common/fileMenu";

export class PopoverMinimalExample extends React.PureComponent<IExampleProps> {
    public render() {
        const baseProps: IPopoverProps = { content: <FileMenu />, position: Position.BOTTOM_LEFT };

        return (
            <Example options={false} {...this.props}>
                <Popover {...baseProps} minimal={true}>
                    <Button intent={Intent.PRIMARY}>Minimal</Button>
                </Popover>
                <Popover {...baseProps}>
                    <Button>Default</Button>
                </Popover>
            </Example>
        );
    }
}
