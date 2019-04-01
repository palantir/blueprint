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

import { Classes, Icon } from "@blueprintjs/core";
import classNames from "classnames";
import { IHeadingTag } from "documentalist/dist/client";
import * as React from "react";

export const Heading: React.SFC<IHeadingTag> = ({ level, route, value }) =>
    // use createElement so we can dynamically choose tag based on depth
    React.createElement(
        `h${level}`,
        { className: classNames(Classes.HEADING, "docs-title") },
        <a className="docs-anchor" data-route={route} key="anchor" />,
        <a className="docs-anchor-link" href={"#" + route} key="link">
            <Icon icon="link" />
        </a>,
        value,
    );
Heading.displayName = "Docs2.Heading";
