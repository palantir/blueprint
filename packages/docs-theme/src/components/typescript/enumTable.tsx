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

import { ITsEnum, ITsEnumMember } from "@documentalist/client";
import classNames from "classnames";
import React, { useCallback, useContext } from "react";

import { Props } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../../common";
import { DocumentationContext } from "../../common/context";
import { ModifierTable } from "../modifierTable";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";

export type Renderer<T> = (props: T) => React.ReactNode;

export interface EnumTableProps extends Props {
    data: ITsEnum;
}

export const EnumTable: React.FC<EnumTableProps> = props => {
    const { renderBlock } = useContext(DocumentationContext);

    const renderPropRow = useCallback(
        (entry: ITsEnumMember) => {
            const {
                flags: { isDeprecated, isExternal },
                name,
            } = entry;

            const classes = classNames("docs-prop-name", {
                "docs-prop-is-deprecated": !!isDeprecated,
                "docs-prop-is-internal": !isExternal,
            });

            // this is inside RUNNING_TEXT
            /* eslint-disable @blueprintjs/html-components */
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
                        <div className="docs-prop-tags">
                            <DeprecatedTag isDeprecated={isDeprecated} />
                        </div>
                    </td>
                </tr>
            );
        },
        [renderBlock],
    );

    return (
        <div className={classNames("docs-modifiers", props.className)}>
            <ApiHeader {...props.data} />
            {renderBlock(props.data.documentation)}
            <ModifierTable emptyMessage="This enum is empty." title="Members">
                {props.data.members.map(renderPropRow)}
            </ModifierTable>
        </div>
    );
};
EnumTable.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.EnumTable`;
