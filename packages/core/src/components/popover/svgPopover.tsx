/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { IPopoverProps, Popover } from "./popover";

export class SVGPopover extends React.Component<IPopoverProps, {}> {
    public render() {
        return (
            <Popover rootElementTag="g" {...this.props}>
                {this.props.children}
            </Popover>
        );
    }
}
