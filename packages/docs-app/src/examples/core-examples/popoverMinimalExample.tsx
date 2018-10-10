/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, IPopoverProps, Popover, Position, TargetRenderer } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { FileMenu } from "./common/fileMenu";

export class PopoverMinimalExample extends React.PureComponent<IExampleProps> {
    public render() {
        const baseProps: IPopoverProps = { content: <FileMenu />, position: Position.BOTTOM_LEFT };

        return (
            <Example options={false} {...this.props}>
                <Popover {...baseProps} minimal={true} target={this.renderLeftButton} />
                <Popover {...baseProps} target={this.renderRightButton} />
            </Example>
        );
    }

    private renderLeftButton: TargetRenderer = (props, ref, isOpen) => {
        return <Button active={isOpen} intent="primary" text="Minimal" elementRef={ref} {...props} />;
    };

    private renderRightButton: TargetRenderer = (props, ref, isOpen) => {
        return <Button active={isOpen} text="Default" elementRef={ref} {...props} />;
    };
}
