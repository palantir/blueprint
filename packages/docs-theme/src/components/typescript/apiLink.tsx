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

import React, { useCallback, useContext } from "react";

import { Props } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../../common";
import { DocumentationContext } from "../../common/context";

export interface ApiLinkProps extends Props {
    children?: never;
    name: string;
}

/**
 * Renders a link to open a symbol in the API Browser.
 */
export const ApiLink: React.FC<ApiLinkProps> = ({ className, name }) => {
    const { showApiDocs } = useContext(DocumentationContext);
    const handleClick = useCallback((evt: React.MouseEvent<HTMLAnchorElement>) => {
        evt.preventDefault();
        showApiDocs(name);
    }, []);

    return (
        <a className={className} href={`#api/${name}`} onClick={handleClick}>
            {name}
        </a>
    );
};
ApiLink.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.ApiLink`;
