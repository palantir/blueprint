/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import { IPopoverProps, Popover } from "./popover";

export class SVGPopover extends React.Component<IPopoverProps, {}> {
    public render() {
        return <Popover rootElementTag="g" {...this.props}>{this.props.children}</Popover>;
    }
}

export const SVGPopoverFactory = React.createFactory(SVGPopover);
