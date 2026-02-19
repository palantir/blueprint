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
import { useContext, useMemo } from "react";

import { Classes, Intent, type Props, Tag } from "@blueprintjs/core";
import type { PropInfo } from "@blueprintjs/docs-data/src/types";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";
import { PropsDataContext } from "../common/propsDataContext";

import { ModifierTable } from "./modifierTable";
import { DeprecatedTag } from "./typescript/deprecatedTag";

export interface PropsTableProps extends Props {
    /** Interface name to display (e.g. "CalloutProps"). Must match a key in the PropsRegistry. */
    name: string;
}

// rendered inside RUNNING_TEXT
/* eslint-disable @blueprintjs/html-components */

export const PropsTable: React.FC<PropsTableProps> = ({ className, name }) => {
    const registry = useContext(PropsDataContext);
    const propsInfo = registry[name];

    const visibleProps = useMemo(() => {
        if (propsInfo == null) return [];
        return propsInfo.props.filter(p => !p.internal);
    }, [propsInfo]);

    if (propsInfo == null) {
        return (
            <div className={classNames("docs-modifiers", className)}>
                <div className="docs-interface-header">
                    <div className="docs-interface-name">
                        <small>interface</small> {name}
                    </div>
                </div>
                <ModifierTable emptyMessage={`No documentation found for "${name}".`} title="Props">
                    {null}
                </ModifierTable>
            </div>
        );
    }

    return (
        <div className={classNames("docs-modifiers", className)}>
            <div className="docs-interface-header">
                <div className="docs-interface-name">
                    <small>interface</small> {propsInfo.name}
                </div>
            </div>
            <ModifierTable emptyMessage="This interface is empty." title="Props">
                {visibleProps.map(prop => (
                    <PropRow key={prop.name} prop={prop} interfaceName={propsInfo.name} />
                ))}
            </ModifierTable>
        </div>
    );
};
PropsTable.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.PropsTable`;

function PropRow({ prop, interfaceName }: { prop: PropInfo; interfaceName: string }) {
    const isDeprecated = prop.deprecated !== false;
    const classes = classNames("docs-prop-name", {
        "docs-prop-is-deprecated": isDeprecated,
        "docs-prop-is-required": prop.required,
    });

    return (
        <tr>
            <td className={classes}>
                <code>{prop.name}</code>
            </td>
            <td className="docs-prop-details">
                <code className="docs-prop-type">
                    <strong>{prop.type}</strong>
                    {prop.defaultValue != null && (
                        <em className={classNames("docs-prop-default", Classes.TEXT_MUTED)}>{prop.defaultValue}</em>
                    )}
                </code>
                <div className="docs-prop-description">
                    <div className={Classes.RUNNING_TEXT} dangerouslySetInnerHTML={markdownCode(prop.description)} />
                </div>
                <div className="docs-prop-tags">
                    {prop.required && <Tag children="Required" intent={Intent.SUCCESS} minimal={true} />}
                    <DeprecatedTag
                        isDeprecated={typeof prop.deprecated === "string" ? prop.deprecated : prop.deprecated}
                    />
                    {prop.parentName != null && prop.parentName !== interfaceName && (
                        <Tag minimal={true}>
                            Inherited from <code>{prop.parentName}</code>
                        </Tag>
                    )}
                </div>
            </td>
        </tr>
    );
}

/**
 * Minimal markdown renderer that supports backtick `code` elements, triple-backtick `pre` elements,
 * and basic line breaks. Same pattern as DeprecatedTag's markdownCode.
 */
function markdownCode(text: string) {
    return {
        __html: text
            .replace(/</g, "&lt;")
            .replace(/```([^`]+)```/g, (_, code) => `<pre>${code}</pre>`)
            .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)
            .replace(/\n\n/g, "<br/><br/>"),
    };
}
