/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import React from "react";
import { BlueprintDoczConfig, IThemeConfig } from "../config";

export class Wrapper extends React.PureComponent<IThemeConfig> {
    public render() {
        const { children, ...value } = this.props;
        return <BlueprintDoczConfig value={value}>{children}</BlueprintDoczConfig>;
    }
}
