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
import { createElement } from "react";

import { Classes } from "@blueprintjs/core";
import { Link } from "@blueprintjs/icons";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";

export interface DocsHeadingProps {
    level: number;
    route: string;
    children: React.ReactNode;
}

/** Renders a heading with anchor links. Usable from both Tag renderers and MDX components. */
export const DocsHeading: React.FC<DocsHeadingProps> = ({ level, route, children }) => {
    const className = classNames(Classes.HEADING, "docs-title");
    const content = [
        <a className="docs-anchor" data-route={route} key="anchor" aria-hidden={true} tabIndex={-1} />,
        <a className="docs-anchor-link" href={"#" + route} key="link" aria-hidden={true} tabIndex={-1}>
            <Link />
        </a>,
        children,
    ];

    // use createElement so we can dynamically choose tag based on depth
    return createElement(`h${level}`, { className }, content);
};
DocsHeading.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.DocsHeading`;

export const Heading: React.FC<Tag> = props => {
    if (!isHeadingTag(props)) {
        return null;
    }

    return <DocsHeading level={props.level} route={props.route} children={props.value} />;
};
Heading.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.Heading`;
