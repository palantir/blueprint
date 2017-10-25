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

import { Classes, Intent, Tag } from "@blueprintjs/core";
import * as classNames from "classnames";
import { ITsInterfaceEntry } from "documentalist/dist/client";
import * as React from "react";
import { IInheritedPropertyEntry } from "../common/propsStore";
import { ITagRendererMap } from "../tags";
import { renderContentsBlock } from "./block";

// HACKHACK support `code` blocks until we get real markdown parsing in ts-quick-docs
function dirtyMarkdown(text: string) {
    return {
        __html: text
            .replace("<", "&lt;")
            .replace(/```([^`]+)```/g, (_, code) => `<pre>${code}</pre>`)
            .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`),
    };
}

function propTag(intent: Intent, title: string, ...children: React.ReactNode[]) {
    return (
        <Tag key={title} className={Classes.MINIMAL} intent={intent}>
            {title}
            {children}
        </Tag>
    );
}

const renderPropRow = (prop: IInheritedPropertyEntry) => {
    const { documentation, inheritedFrom, name, optional } = prop;
    const { default: defaultValue, deprecated, internal } = prop.tags;

    if (internal) {
        return undefined;
    }

    const classes = classNames("docs-prop-name", {
        "docs-prop-is-deprecated": deprecated != null,
        "docs-prop-is-internal": internal,
        "docs-prop-is-required": !optional,
    });

    const tags: JSX.Element[] = [];
    if (!optional) {
        tags.push(propTag(Intent.SUCCESS, "Required"));
    }
    if (deprecated) {
        const maybeMessage =
            typeof deprecated === "string" ? (
                <span key="__deprecated_msg" dangerouslySetInnerHTML={dirtyMarkdown(": " + deprecated)} />
            ) : (
                ""
            );
        tags.push(propTag(Intent.DANGER, "Deprecated", maybeMessage));
    }
    if (inheritedFrom != null) {
        tags.push(propTag(Intent.NONE, "Inherited", " from ", <code key="__code">{inheritedFrom}</code>));
    }

    const formattedType = prop.type.replace(/\b(JSX\.)?Element\b/, "JSX.Element");

    // TODO: this ignores tags in prop docs, but that's kind of OK cuz they all get processed
    // into prop.tags by the TS compiler.
    const html = documentation.contents.reduce<string>((a, b) => (typeof b === "string" ? a + b : a), "");

    return (
        <tr key={name}>
            <td className={classes}>
                <code>{name}</code>
            </td>
            <td className="docs-prop-details">
                <code className="docs-prop-type">
                    <strong>{formattedType}</strong>
                    <em className="docs-prop-default pt-text-muted">{defaultValue}</em>
                </code>
                <div className="docs-prop-description" dangerouslySetInnerHTML={{ __html: html }} />
                <p className="docs-prop-tags">{tags}</p>
            </td>
        </tr>
    );
};

export interface IInterfaceTableProps {
    iface: ITsInterfaceEntry;
    props: IInheritedPropertyEntry[];
    tagRenderers: ITagRendererMap;
}

export const InterfaceTable: React.SFC<IInterfaceTableProps> = ({ iface, props, tagRenderers }) => {
    return (
        <div className="docs-modifiers">
            <div className="docs-interface-name">{iface.name}</div>
            {renderContentsBlock(iface.documentation.contents, tagRenderers)}
            <table className="pt-table">
                <thead>
                    <tr>
                        <th>Prop</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>{props.map(renderPropRow)}</tbody>
            </table>
        </div>
    );
};
InterfaceTable.displayName = "Docs.InterfaceTable";
