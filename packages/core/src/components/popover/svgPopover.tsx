/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { IPopoverProps, Popover } from "./popover";

export class SVGPopover extends React.Component<IPopoverProps, {}> {
    public render() {
        return <Popover rootElementTag="g" {...this.props}>{this.props.children}</Popover>;
    }
}

export const SVGPopoverFactory = React.createFactory(SVGPopover);
