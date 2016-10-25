/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import { ITooltipProps, Tooltip } from "./tooltip";

export class SVGTooltip extends React.Component<ITooltipProps, {}> {
    public render() {
        return <Tooltip rootElementTag="g" {...this.props}>{this.props.children}</Tooltip>;
    }
}

export var SVGTooltipFactory = React.createFactory(SVGTooltip);
