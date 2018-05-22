/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps } from "@blueprintjs/core";
import classNames from "classnames";
import { ITsEnum, ITsEnumMember } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";
import { ModifierTable } from "../modifierTable";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";

export type Renderer<T> = (props: T) => React.ReactNode;

export interface IEnumTableProps extends IProps {
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
            <div className={classNames("docs-modifiers", this.props.className)}>
                <ApiHeader {...data} />
                {renderBlock(data.documentation)}
                <ModifierTable emptyMessage="This enum is empty." title="Members">
                    {data.members.map(this.renderPropRow)}
                </ModifierTable>
            </div>
        );
    }

    private renderPropRow = (entry: ITsEnumMember) => {
        const { renderBlock } = this.context;
        const { flags: { isDeprecated, isExternal }, name } = entry;

        const classes = classNames("docs-prop-name", {
            "docs-prop-is-deprecated": !!isDeprecated,
            "docs-prop-is-internal": !isExternal,
        });

        // tslint:disable:blueprint-html-components - this is inside RUNNING_TEXT
        return (
            <tr key={name}>
                <td className={classes}>
                    <code>{name}</code>
                </td>
                <td className="docs-prop-details">
                    <code className="docs-prop-type">
                        <strong>{entry.defaultValue}</strong>
                    </code>
                    <div className="docs-prop-description">{renderBlock(entry.documentation)}</div>
                    <div className="docs-prop-tags">{this.renderTags(entry)}</div>
                </td>
            </tr>
        );
        // tslint:enable:blueprint-html-components
    };

    private renderTags(entry: ITsEnumMember) {
        const { flags: { isDeprecated } } = entry;
        return <DeprecatedTag isDeprecated={isDeprecated} />;
    }
}
