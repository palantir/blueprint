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
import { createElement, useRef } from "react";

import { Classes, Icon } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";
import { useRegisterHeading } from "../components/toc/headingRegistry";

export const Heading: React.FC<Tag> = props => {
    const isHeading = isHeadingTag(props);
    const route = isHeading ? props.route : "";
    const level = isHeading ? props.level : 1;
    const value = isHeading ? props.value : "";

    const headingRef = useRef<HTMLHeadingElement>(null);

    useRegisterHeading(route, headingRef, {
        depth: level,
        title: value,
        url: `#${route}`,
    });

    if (!isHeading) {
        return null;
    }

    const className = classNames(Classes.HEADING, "docs-title", `level-${level}`);
    const children = [
        <a className="docs-anchor" data-route={route} key="anchor" aria-hidden={true} tabIndex={-1} />,
        <a className="docs-anchor-link" href={"#" + route} key="link" aria-label={`Direct link to ${value}`}>
            <Icon icon={"link"} />
        </a>,
        value,
    ];

    return createElement(`h${level}`, { className, id: route, ref: headingRef }, children);
};
Heading.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.Heading`;
