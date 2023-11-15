/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isHeadingTag, type Tag } from "@documentalist/client";
import classNames from "classnames";
import * as React from "react";

import { Classes } from "@blueprintjs/core";
import { Link } from "@blueprintjs/icons";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";

export const Heading: React.FC<Tag> = props => {
    if (!isHeadingTag(props)) {
        return null;
    }

    const { level, route, value } = props;
    const className = classNames(Classes.HEADING, "docs-title");
    const children = [
        <a className="docs-anchor" data-route={route} key="anchor" aria-hidden={true} tabIndex={-1} />,
        <a className="docs-anchor-link" href={"#" + route} key="link" aria-hidden={true} tabIndex={-1}>
            <Link />
        </a>,
        value,
    ];

    // use createElement so we can dynamically choose tag based on depth
    return React.createElement(`h${level}`, { className }, children);
};
Heading.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.Heading`;
