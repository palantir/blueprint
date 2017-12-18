/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { ITooltipProps, Tooltip } from "./tooltip";

export class SVGTooltip extends React.Component<ITooltipProps, {}> {
    public render() {
        return (
            <Tooltip rootElementTag="g" {...this.props}>
                {this.props.children}
            </Tooltip>
        );
    }
}
