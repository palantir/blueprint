/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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

export const SVGTooltipFactory = React.createFactory(SVGTooltip);
