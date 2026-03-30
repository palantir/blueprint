/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";

import { Classes, Intent, Tag } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";

import { ModifierTable } from "./modifierTable";
import { DeprecatedTag } from "./typescript/deprecatedTag";

// Types defined locally to avoid circular dependency on docs-data.
// Structurally compatible with PropInfo / PropsInfo from @blueprintjs/docs-data.

interface PropsTableEntry {
    name: string;
    type: string;
    required: boolean;
    defaultValue: string | null;
    description: string;
    deprecated: boolean | string;
    internal: boolean;
    parentName: string | null;
}

export interface PropsTableProps {
    name: string;
    description?: string;
    filePath?: string;
    props: PropsTableEntry[];
}

// rendered inside RUNNING_TEXT
/* eslint-disable @blueprintjs/html-components */

export const PropsTable: React.FC<PropsTableProps> = ({ name, props }) => {
    const visibleProps = props.filter(p => !p.internal).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="docs-modifiers">
            <div className="docs-interface-header">
                <code>{name}</code>
            </div>
            <ModifierTable emptyMessage="This interface is empty." title="Prop">
                {visibleProps.map(renderPropRow)}
            </ModifierTable>
        </div>
    );
};
PropsTable.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.PropsTable`;

function renderPropRow(entry: PropsTableEntry) {
    const { name, type, required, defaultValue, description, deprecated, parentName } = entry;

    const nameClasses = classNames("docs-prop-name", {
        "docs-prop-is-deprecated": deprecated === true || typeof deprecated === "string",
        "docs-prop-is-required": required,
    });

    return (
        <tr key={name}>
            <td className={nameClasses}>
                <code>{name}</code>
            </td>
            <td className="docs-prop-details">
                <code className="docs-prop-type">
                    <strong>{type}</strong>
                    {defaultValue != null && (
                        <em className={classNames("docs-prop-default", Classes.TEXT_MUTED)}>{defaultValue}</em>
                    )}
                </code>
                <div className="docs-prop-description">{description}</div>
                <div className="docs-prop-tags">
                    {required && <Tag children="Required" intent={Intent.SUCCESS} minimal={true} />}
                    <DeprecatedTag isDeprecated={deprecated} />
                    {parentName != null && (
                        <Tag minimal={true}>
                            Inherited from <code>{parentName}</code>
                        </Tag>
                    )}
                </div>
            </td>
        </tr>
    );
}
