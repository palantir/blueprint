/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Icon } from "@blueprintjs/core";
import { IHeadingTag } from "documentalist/dist/client";
import * as React from "react";

export const Heading: React.SFC<IHeadingTag> = ({ level, route, value }) =>
    // use createElement so we can dynamically choose tag based on depth
    React.createElement(
        `h${level}`,
        { className: "docs-title" },
        <a className="docs-anchor" data-route={route} key="anchor" />,
        <a className="docs-anchor-link" href={"#" + route} key="link">
            <Icon iconName="link" />
        </a>,
        value,
    );
Heading.displayName = "Docs.Heading";
