/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import { ITsEnum, ITsEnumMember } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";
import { ModifierTable } from "../modifierTable";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";

export type Renderer<T> = (props: T) => React.ReactNode;

export interface IEnumTableProps {
    data: ITsEnum;
}

export class EnumTable extends React.PureComponent<IEnumTableProps> {
    public static contextTypes = DocumentationContextTypes;
    public static displayName = "Docs2.EnumTable";

    public context: IDocumentationContext;

    public render() {
        const { data } = this.props;
        const { renderBlock } = this.context;
        return (
            <div className="docs-modifiers pt-running-text-small">
                <ApiHeader {...data} />
                {renderBlock(data.documentation)}
                <ModifierTable title="Members">{data.members.map(this.renderPropRow)}</ModifierTable>
            </div>
        );
    }

    private renderPropRow = (entry: ITsEnumMember) => {
        const { renderBlock } = this.context;
        const { flags: { isDeprecated, isExternal, isOptional }, name } = entry;

        const classes = classNames("docs-prop-name", {
            "docs-prop-is-deprecated": !!isDeprecated,
            "docs-prop-is-internal": !isExternal,
            "docs-prop-is-required": !isOptional,
        });

        return (
            <tr key={name}>
                <td className={classes}>
                    <code>{name}</code>
                </td>
                <td className="docs-prop-details">
                    <code className="docs-prop-type">
                        <strong>{entry.name}</strong>
                        <em className="docs-prop-default pt-text-muted">{entry.defaultValue}</em>
                    </code>
                    <div className="docs-prop-description">{renderBlock(entry.documentation)}</div>
                    <p className="docs-prop-tags">{this.renderTags(entry)}</p>
                </td>
            </tr>
        );
    };

    private renderTags(entry: ITsEnumMember) {
        const { flags: { isDeprecated } } = entry;
        return <DeprecatedTag isDeprecated={isDeprecated} />;
    }
}
