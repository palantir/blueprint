/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import { isTag, ITsMethod, ITsParameter, ITsSignature } from "@documentalist/client";
import classNames from "classnames";
import React, { useCallback, useContext } from "react";

import { Code, Intent, Props, Tag } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../../common";
import { DocumentationContext } from "../../common/context";
import { ModifierTable } from "../modifierTable";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";

export type Renderer<T> = (props: T) => React.ReactNode;

export interface MethodTableProps extends Props {
    data: ITsMethod;
}

export const MethodTable: React.FC<MethodTableProps> = ({ className, data }) => {
    const { renderBlock, renderType } = useContext(DocumentationContext);

    const renderPropRow = useCallback((parameter: ITsParameter) => {
        const {
            flags: { isDeprecated, isExternal, isOptional },
            name,
        } = parameter;
        const { documentation } = parameter;

        // ignore props marked with `@internal` tag (this tag is in contents instead of in flags)
        if (
            documentation != null &&
            documentation.contents != null &&
            documentation.contents.some(val => isTag(val) && val.tag === "internal")
        ) {
            return null;
        }

        const classes = classNames("docs-prop-name", {
            "docs-prop-is-deprecated": isDeprecated === true || typeof isDeprecated === "string",
            "docs-prop-is-internal": !isExternal,
            "docs-prop-is-required": !isOptional,
        });

        const typeInfo = (
            <>
                <strong>{renderType(parameter.type)}</strong>
            </>
        );

        return (
            <tr key={name}>
                <td className={classes}>
                    <Code>{name}</Code>
                </td>
                <td className="docs-prop-details">
                    <Code className="docs-prop-type">{typeInfo}</Code>
                    <div className="docs-prop-description">{renderBlock(documentation)}</div>
                    <div className="docs-prop-tags">
                        {!isOptional && <Tag children="Required" intent={Intent.SUCCESS} minimal={true} />}
                        <DeprecatedTag isDeprecated={isDeprecated} />
                    </div>
                </td>
            </tr>
        );
    }, []);

    const renderReturnSignature = useCallback((entry?: ITsSignature) => {
        if (entry == null) {
            return null;
        }

        return (
            <tr key={entry.name}>
                <td className="docs-prop-name">
                    <Code className="docs-prop-type">{renderType(entry.returnType)}</Code>
                </td>
                <td className="docs-prop-details">
                    <div className="docs-prop-description">{renderBlock(entry.documentation)}</div>
                </td>
            </tr>
        );
    }, []);

    const propRows = [...data.signatures]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entry: ITsSignature) => entry.parameters.map(renderPropRow));
    return (
        <div className={classNames("docs-modifiers", className)}>
            <ApiHeader {...data} />
            <ModifierTable emptyMessage="No return" title="Returns" descriptionTitle="">
                {renderReturnSignature(data.signatures[0])}
            </ModifierTable>
            <ModifierTable emptyMessage="This parameter is empty." title="Parameters">
                {propRows}
            </ModifierTable>
        </div>
    );
};
MethodTable.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.MethodTable`;
