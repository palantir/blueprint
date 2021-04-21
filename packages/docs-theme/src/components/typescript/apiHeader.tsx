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

import { isTsClass, isTsInterface, ITsDocBase } from "@documentalist/client";
import React, { useContext } from "react";

import { COMPONENT_DISPLAY_NAMESPACE } from "../../common";
import { DocumentationContext } from "../../common/context";

export const ApiHeader: React.FC<ITsDocBase> = props => {
    const { renderType, renderViewSourceLinkText } = useContext(DocumentationContext);
    let inheritance: React.ReactNode = "";

    if (isTsClass(props) || isTsInterface(props)) {
        const extendsTypes = maybeJoinArray("extends", props.extends);
        const implementsTypes = maybeJoinArray("implements", props.implements);
        inheritance = renderType(`${extendsTypes} ${implementsTypes}`);
    }

    return (
        <div className="docs-interface-header">
            <div className="docs-interface-name">
                <small>{props.kind}</small> {props.name} <small>{inheritance}</small>
            </div>
            <small className="docs-package-name">
                <a href={props.sourceUrl} target="_blank">
                    {renderViewSourceLinkText(props)}
                </a>
            </small>
            {props.children}
        </div>
    );
};
ApiHeader.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.ApiHeader`;

function maybeJoinArray(title: string, array: string[] | undefined): string {
    if (array == null || array.length === 0) {
        return "";
    }
    return `${title} ${array.join(", ")}`;
}
