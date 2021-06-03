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

import {
    isTag,
    isTsProperty,
    ITsClass,
    ITsInterface,
    ITsMethod,
    ITsProperty,
    ITsSignature,
} from "@documentalist/client";
import classNames from "classnames";
import React, { useCallback, useContext } from "react";

import { Classes, Intent, Props, Tag } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../../common";
import { DocumentationContext } from "../../common/context";
import { ModifierTable } from "../modifierTable";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";

export type Renderer<T> = (props: T) => React.ReactNode;

export interface InterfaceTableProps extends Props {
    data: ITsClass | ITsInterface;
    title: string;
}

// rendered inside RUNNING_TEXT
/* eslint-disable @blueprintjs/html-components */

export const InterfaceTable: React.FC<InterfaceTableProps> = ({ className, data, title }) => {
    const { renderBlock, renderType } = useContext(DocumentationContext);

    const renderPropRow = useCallback((entry: ITsProperty | ITsMethod) => {
        const {
            flags: { isDeprecated, isExternal, isOptional },
            name,
            inheritedFrom,
        } = entry;
        const { documentation } = isTsProperty(entry) ? entry : entry.signatures[0];

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

        const typeInfo = isTsProperty(entry) ? (
            <>
                <strong>{renderType(entry.type)}</strong>
                <em className={classNames("docs-prop-default", Classes.TEXT_MUTED)}>{entry.defaultValue}</em>
            </>
        ) : (
            <>
                <strong>{renderType(entry.signatures[0].type)}</strong>
            </>
        );

        return (
            <tr key={name}>
                <td className={classes}>
                    <code>{name}</code>
                </td>
                <td className="docs-prop-details">
                    <code className="docs-prop-type">{typeInfo}</code>
                    <div className="docs-prop-description">{renderBlock(documentation)}</div>
                    <div className="docs-prop-tags">
                        {!isOptional && <Tag children="Required" intent={Intent.SUCCESS} minimal={true} />}
                        <DeprecatedTag isDeprecated={isDeprecated} />
                        {inheritedFrom && (
                            <Tag minimal={true}>
                                Inherited from <code>{renderType(inheritedFrom)}</code>
                            </Tag>
                        )}
                    </div>
                </td>
            </tr>
        );
    }, []);

    const renderIndexSignature = useCallback((entry?: ITsSignature) => {
        if (entry == null) {
            return null;
        }
        // HACKHACK: Documentalist's indexSignature support isn't _great_, but it's certainly _good enough_
        // entry.type looks like "{ [name: string]: (date: Date) => boolean }"
        const [signature, returnType] = entry.type.slice(2, -2).split("]: ");
        return (
            <tr key={entry.name}>
                <td className="docs-prop-name">
                    <code>{renderType(signature)}]</code>
                </td>
                <td className="docs-prop-details">
                    <code className="docs-prop-type">{renderType(returnType)}</code>
                    <div className="docs-prop-description">{renderBlock(entry.documentation)}</div>
                </td>
            </tr>
        );
    }, []);

    const propRows = [...data.properties, ...data.methods]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(renderPropRow);

    return (
        <div className={classNames("docs-modifiers", className)}>
            <ApiHeader {...data} />
            {renderBlock(data.documentation)}
            <ModifierTable emptyMessage="This interface is empty." title={title}>
                {propRows}
                {renderIndexSignature(data.indexSignature)}
            </ModifierTable>
        </div>
    );
};
InterfaceTable.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.InterfaceTable`;
