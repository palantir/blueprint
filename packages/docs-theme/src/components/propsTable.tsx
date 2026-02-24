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
import { useCallback, useContext, useState } from "react";

import { Classes, Drawer, DrawerSize, Intent, Tag } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";
import { DocumentationContext } from "../common/context";

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
    const { getPropsData } = useContext(DocumentationContext);
    const [drawerName, setDrawerName] = useState<string | null>(null);

    const handleInterfaceClick = useCallback((interfaceName: string) => {
        setDrawerName(interfaceName);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setDrawerName(null);
    }, []);

    const visibleProps = props.filter(p => !p.internal).sort((a, b) => a.name.localeCompare(b.name));
    const hasLookup = getPropsData != null;
    const drawerData = drawerName != null && hasLookup ? getPropsData(drawerName) : undefined;

    // Derive the extends clause from parentName values
    const extendsNames = hasLookup
        ? [...new Set(props.filter(p => p.parentName != null && p.parentName !== name).map(p => p.parentName!))]
        : [];

    return (
        <div className="docs-modifiers">
            <div className="docs-interface-header">
                <code>
                    {name}
                    {extendsNames.length > 0 && (
                        <span className="docs-extends-clause">
                            {" extends "}
                            {extendsNames.map((parentName, i) => (
                                <span key={parentName}>
                                    {i > 0 && ", "}
                                    <a
                                        className="docs-parent-link"
                                        role="button"
                                        onClick={e => {
                                            e.preventDefault();
                                            handleInterfaceClick(parentName);
                                        }}
                                    >
                                        {parentName}
                                    </a>
                                </span>
                            ))}
                        </span>
                    )}
                </code>
            </div>
            <ModifierTable emptyMessage="This interface is empty." title="Prop">
                {visibleProps.map(entry =>
                    renderPropRow(
                        entry,
                        hasLookup ? handleInterfaceClick : undefined,
                        hasLookup ? getPropsData : undefined,
                    ),
                )}
            </ModifierTable>
            {hasLookup && (
                <Drawer
                    className="docs-api-drawer"
                    isOpen={drawerName != null}
                    onClose={handleDrawerClose}
                    position="right"
                    size={DrawerSize.STANDARD}
                    title={drawerName}
                >
                    <DrawerPropsContent
                        data={drawerData}
                        name={drawerName ?? undefined}
                        onInterfaceClick={handleInterfaceClick}
                        getPropsData={getPropsData!}
                    />
                </Drawer>
            )}
        </div>
    );
};
PropsTable.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.PropsTable`;

// ---------------------------------------------------------------------------
// Drawer body content (rendered inside the Drawer overlay)
// ---------------------------------------------------------------------------

interface DrawerPropsContentProps {
    data: PropsTableProps | undefined;
    name: string | undefined;
    onInterfaceClick: (name: string) => void;
    getPropsData: (name: string) => PropsTableProps | undefined;
}

const DrawerPropsContent: React.FC<DrawerPropsContentProps> = ({ data, name, onInterfaceClick, getPropsData }) => {
    if (data == null || name == null) {
        return (
            <div className={Classes.DRAWER_BODY}>
                <div className={classNames(Classes.TEXT_MUTED, "docs-drawer-empty")} style={{ padding: 20 }}>
                    No data found for <code>{name}</code>.
                </div>
            </div>
        );
    }

    const visibleProps = data.props.filter(p => !p.internal).sort((a, b) => a.name.localeCompare(b.name));

    // Derive extends clause for the drawer interface
    const extendsNames = [
        ...new Set(data.props.filter(p => p.parentName != null && p.parentName !== name).map(p => p.parentName!)),
    ];

    return (
        <div className={Classes.DRAWER_BODY}>
            <div className="docs-modifiers">
                {extendsNames.length > 0 && (
                    <div className="docs-interface-header">
                        <code>
                            {name}
                            <span className="docs-extends-clause">
                                {" extends "}
                                {extendsNames.map((parentName, i) => (
                                    <span key={parentName}>
                                        {i > 0 && ", "}
                                        <a
                                            className="docs-parent-link"
                                            role="button"
                                            onClick={e => {
                                                e.preventDefault();
                                                onInterfaceClick(parentName);
                                            }}
                                        >
                                            {parentName}
                                        </a>
                                    </span>
                                ))}
                            </span>
                        </code>
                    </div>
                )}
                <ModifierTable emptyMessage="This interface is empty." title="Prop">
                    {visibleProps.map(entry => renderPropRow(entry, onInterfaceClick, getPropsData))}
                </ModifierTable>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Type string linkification helper
// ---------------------------------------------------------------------------

const PASCAL_CASE_RE = /[A-Z][A-Za-z0-9_]*/g;

function renderTypeWithLinks(
    typeStr: string,
    onInterfaceClick: (name: string) => void,
    getPropsData: (name: string) => PropsTableProps | undefined,
): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = PASCAL_CASE_RE.exec(typeStr)) !== null) {
        const matchedName = match[0];
        const matchIndex = match.index;

        // Add text before this match
        if (matchIndex > lastIndex) {
            parts.push(typeStr.slice(lastIndex, matchIndex));
        }

        // Check if this identifier is in the registry
        if (getPropsData(matchedName) != null) {
            parts.push(
                <a
                    key={`${matchedName}-${matchIndex}`}
                    className="docs-parent-link"
                    role="button"
                    onClick={e => {
                        e.preventDefault();
                        onInterfaceClick(matchedName);
                    }}
                >
                    {matchedName}
                </a>,
            );
        } else {
            parts.push(matchedName);
        }

        lastIndex = matchIndex + matchedName.length;
    }

    // Add remaining text after last match
    if (lastIndex < typeStr.length) {
        parts.push(typeStr.slice(lastIndex));
    }

    return parts.length > 0 ? parts : typeStr;
}

// ---------------------------------------------------------------------------
// Prop row renderer
// ---------------------------------------------------------------------------

function renderPropRow(
    entry: PropsTableEntry,
    onInterfaceClick?: (name: string) => void,
    getPropsData?: (name: string) => PropsTableProps | undefined,
) {
    const { name, type, required, defaultValue, description, deprecated, parentName } = entry;

    const nameClasses = classNames("docs-prop-name", {
        "docs-prop-is-deprecated": deprecated === true || typeof deprecated === "string",
        "docs-prop-is-required": required,
    });

    const typeContent =
        onInterfaceClick != null && getPropsData != null
            ? renderTypeWithLinks(type, onInterfaceClick, getPropsData)
            : type;

    return (
        <tr key={name}>
            <td className={nameClasses}>
                <code>{name}</code>
            </td>
            <td className="docs-prop-details">
                <code className="docs-prop-type">
                    <strong>{typeContent}</strong>
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
                            Inherited from{" "}
                            {onInterfaceClick != null ? (
                                <a
                                    className="docs-parent-link"
                                    role="button"
                                    onClick={e => {
                                        e.preventDefault();
                                        onInterfaceClick(parentName);
                                    }}
                                >
                                    <code>{parentName}</code>
                                </a>
                            ) : (
                                <code>{parentName}</code>
                            )}
                        </Tag>
                    )}
                </div>
            </td>
        </tr>
    );
}
