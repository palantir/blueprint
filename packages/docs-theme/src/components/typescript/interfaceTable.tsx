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

import { Classes, Intent, IProps, Tag } from "@blueprintjs/core";
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
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";
import { ModifierTable } from "../modifierTable";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";

export type Renderer<T> = (props: T) => React.ReactNode;

export interface IInterfaceTableProps extends IProps {
    data: ITsClass | ITsInterface;
    title: string;
}

// tslint:disable:blueprint-html-components - rendered inside RUNNING_TEXT
export class InterfaceTable extends React.PureComponent<IInterfaceTableProps> {
    public static contextTypes = DocumentationContextTypes;
    public static displayName = "Docs2.InterfaceTable";

    public context: IDocumentationContext;

    public render() {
        const { data, title } = this.props;
        const { renderBlock } = this.context;
        const propRows = [...data.properties, ...data.methods]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(this.renderPropRow);
        return (
            <div className={classNames("docs-modifiers", this.props.className)}>
                <ApiHeader {...data} />
                {renderBlock(data.documentation)}
                <ModifierTable emptyMessage="This interface is empty." title={title}>
                    {propRows}
                    {this.renderIndexSignature(data.indexSignature)}
                </ModifierTable>
            </div>
        );
    }

    private renderPropRow = (entry: ITsProperty | ITsMethod) => {
        const { renderBlock, renderType } = this.context;
        const {
            flags: { isDeprecated, isExternal, isOptional },
            name,
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
                    <div className="docs-prop-tags">{this.renderTags(entry)}</div>
                </td>
            </tr>
        );
    };

    private renderIndexSignature(entry?: ITsSignature) {
        if (entry == null) {
            return null;
        }
        const { renderBlock, renderType } = this.context;
        // HACKHACK: Documentalist's indexSignature support isn't _great_, but it's certainly _good enough_
        // entry.type looks like "{ [name: string]: (date: Date) => boolean }"
        const [signature, returnType] = entry.type.slice(2, -2).split("]: ");
        return (
            <tr key={name}>
                <td className="docs-prop-name">
                    <code>{renderType(signature)}]</code>
                </td>
                <td className="docs-prop-details">
                    <code className="docs-prop-type">{renderType(returnType)}</code>
                    <div className="docs-prop-description">{renderBlock(entry.documentation)}</div>
                </td>
            </tr>
        );
    }

    private renderTags(entry: ITsProperty | ITsMethod) {
        const { renderType } = this.context;
        const {
            flags: { isDeprecated, isOptional },
            inheritedFrom,
        } = entry;
        return (
            <>
                {!isOptional && <Tag children="Required" intent={Intent.SUCCESS} minimal={true} />}
                <DeprecatedTag isDeprecated={isDeprecated} />
                {inheritedFrom && (
                    <Tag minimal={true}>
                        Inherited from <code>{renderType(inheritedFrom)}</code>
                    </Tag>
                )}
            </>
        );
    }
}
