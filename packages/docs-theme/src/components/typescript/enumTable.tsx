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

import { IProps } from "@blueprintjs/core";
import { ITsEnum, ITsEnumMember } from "@documentalist/client";
import classNames from "classnames";
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
        const {
            flags: { isDeprecated, isExternal },
            name,
        } = entry;

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
        const {
            flags: { isDeprecated },
        } = entry;
        return <DeprecatedTag isDeprecated={isDeprecated} />;
    }
}
