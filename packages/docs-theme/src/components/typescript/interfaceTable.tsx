/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Intent, Tag } from "@blueprintjs/core";
import * as classNames from "classnames";
import { isTsProperty, ITsClass, ITsInterface, ITsMethod, ITsProperty } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";

export type Renderer<T> = (props: T) => React.ReactNode;

export interface IInterfaceTableProps {
    data: ITsClass | ITsInterface;
    title: string;
}

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
            <div className="docs-modifiers">
                <ApiHeader {...data} />
                {renderBlock(data.documentation)}
                <table className="pt-html-table">
                    <thead>
                        <tr>
                            <th>{title}</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>{propRows}</tbody>
                </table>
            </div>
        );
    }

    private renderPropRow = (entry: ITsProperty | ITsMethod) => {
        const { renderBlock, renderType } = this.context;
        const { flags: { isDeprecated, isExternal, isOptional }, name } = entry;
        const { documentation } = isTsProperty(entry) ? entry : entry.signatures[0];

        const classes = classNames("docs-prop-name", {
            "docs-prop-is-deprecated": isDeprecated === true || typeof isDeprecated === "string",
            "docs-prop-is-internal": !isExternal,
            "docs-prop-is-required": !isOptional,
        });

        const typeInfo = isTsProperty(entry) ? (
            <>
                <strong>{renderType(entry.type)}</strong>
                <em className="docs-prop-default pt-text-muted">{entry.defaultValue}</em>
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
                    <p className="docs-prop-tags">{this.renderTags(entry)}</p>
                </td>
            </tr>
        );
    };

    private renderTags(entry: ITsProperty | ITsMethod) {
        const { renderType } = this.context;
        const { flags: { isDeprecated, isOptional }, inheritedFrom } = entry;
        return (
            <>
                {!isOptional && <Tag children="Required" className={Classes.MINIMAL} intent={Intent.SUCCESS} />}
                <DeprecatedTag isDeprecated={isDeprecated} />
                {inheritedFrom && (
                    <Tag className={Classes.MINIMAL}>
                        Inherited from <code>{renderType(inheritedFrom)}</code>
                    </Tag>
                )}
            </>
        );
    }
}
