/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Icon } from "@blueprintjs/core";
import classNames from "classnames";
import { Link } from "docz";
import * as React from "react";

export const Heading: React.SFC<{ level: number; id: string }> = ({ children, id, level }) =>
    // use createElement so we can dynamically choose tag based on depth
    React.createElement(
        `h${level}`,
        { className: classNames(Classes.HEADING, "docs-title") },
        <a className="docs-anchor" id={id} key="anchor" />,
        <Link className="docs-anchor-link" to={"#" + id} key="link">
            <Icon icon="link" />
        </Link>,
        children,
    );
Heading.displayName = "Docs.Heading";
