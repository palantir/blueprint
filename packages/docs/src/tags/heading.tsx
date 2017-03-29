/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IHeadingTag } from "documentalist/dist/client";
import * as React from "react";
import { TagRenderer } from "./";

const Heading: React.SFC<IHeadingTag> = ({ level, route, value }) => (
    // use createElement so we can dynamically choose tag based on depth
    React.createElement(`h${level}`, { className: "docs-title" },
        <a className="docs-anchor" key="anchor" name={route} />,
        <a className="docs-anchor-link" href={"#" + route} key="link">
            <span className="pt-icon-standard pt-icon-link" />
        </a>,
        value,
    )
);
Heading.displayName = "Docs.Heading";

export class HeadingTagRenderer {
    public render: TagRenderer = (heading: IHeadingTag, key) => <Heading key={key} {...heading} />;
}
