/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Intent, Tag } from "@blueprintjs/core";
import * as classNames from "classnames";
import { isTsMethod, ITsEnum, ITsEnumMember } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";
import { ApiHeader } from "./apiHeader";

export type Renderer<T> = (props: T) => React.ReactNode;

export interface IEnumTableProps {
    data: ITsEnum;
}

export class EnumTable extends React.PureComponent<IEnumTableProps> {
    public static contextTypes = DocumentationContextTypes;
    public static displayName = "Docs.EnumTable";

    public context: IDocumentationContext;

    public render() {
        const { data } = this.props;
        const { renderBlock } = this.context;
        return (
            <div className="docs-modifiers">
                <ApiHeader {...data} />
                {renderBlock(data.documentation)}
                <table className="pt-html-table">
                    <thead>
                        <tr>
                            <th>Members</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>{data.members.map(this.renderPropRow)}</tbody>
                </table>
            </div>
        );
    }

    private renderPropRow = (entry: ITsEnumMember) => {
        const { renderBlock, renderType } = this.context;
        const { flags: { isDeprecated, isExternal, isOptional }, name } = entry;

        const classes = classNames("docs-prop-name", {
            "docs-prop-is-deprecated": !!isDeprecated,
            "docs-prop-is-internal": !isExternal,
            "docs-prop-is-required": !isOptional,
        });

        const typeInfo = isTsMethod(entry) ? (
            <>
                <strong>{renderType(entry.signatures[0].type)}</strong>
            </>
        ) : (
            <>
                <strong>{entry.name}</strong>
                {entry.defaultValue && <em className="docs-prop-default pt-text-muted">{entry.defaultValue}</em>}
            </>
        );

        return (
            <tr key={name}>
                <td className={classes}>
                    <code>{name}</code>
                </td>
                <td className="docs-prop-details">
                    <code className="docs-prop-type">{typeInfo}</code>
                    <div className="docs-prop-description">{renderBlock(entry.documentation)}</div>
                    <p className="docs-prop-tags">{this.renderTags(entry)}</p>
                </td>
            </tr>
        );
    };

    private renderTags(entry: ITsEnumMember) {
        const { flags: { isDeprecated } } = entry;
        return (
            (isDeprecated === true || typeof isDeprecated === "string") && (
                <Tag className={Classes.MINIMAL} intent={Intent.DANGER}>
                    {typeof isDeprecated === "string" ? (
                        <span dangerouslySetInnerHTML={dirtyMarkdown(`Deprecated: ${isDeprecated}`)} />
                    ) : (
                        "Deprecated"
                    )}
                </Tag>
            )
        );
    }
}

// HACKHACK support `code` blocks until we get real markdown parsing in ts-quick-docs
function dirtyMarkdown(text: string) {
    return {
        __html: text
            .replace("<", "&lt;")
            .replace(/```([^`]+)```/g, (_, code) => `<pre>${code}</pre>`)
            .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`),
    };
}
