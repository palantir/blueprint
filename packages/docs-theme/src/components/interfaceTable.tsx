/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Intent, Tag } from "@blueprintjs/core";
import * as classNames from "classnames";
import { isTsProperty, ITsClass, ITsInterface, ITsMethod, ITsProperty } from "documentalist/dist/client";
import * as React from "react";
import { ITagRendererMap } from "../tags";
import { renderBlock } from "./block";

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

function renderPropType(prop: ITsProperty | ITsMethod) {
    if (isTsProperty(prop)) {
        const formattedType = prop.type.replace(/\b(JSX\.)?Element\b/, "JSX.Element");
        return (
            <code className="docs-prop-type">
                <strong>{formattedType}</strong>
                <em className="docs-prop-default pt-text-muted">{prop.defaultValue}</em>
            </code>
        );
    } else {
        return (
            <code className="docs-prop-type">
                <strong>{prop.signatures[0].type}</strong>
            </code>
        );
    }
}

function renderPropRow(prop: ITsProperty | ITsMethod) {
    const { flags: { isDeprecated, isExternal, isOptional }, inheritedFrom, name } = prop;
    const isDeprecatedBoolean = isDeprecated === true || typeof isDeprecated === "string";
    const classes = classNames("docs-prop-name", {
        "docs-prop-is-deprecated": isDeprecatedBoolean,
        "docs-prop-is-internal": !isExternal,
        "docs-prop-is-required": !isOptional,
    });

    const tags: JSX.Element[] = [];
    if (!isOptional) {
        tags.push(propTag(Intent.SUCCESS, "Required"));
    }
    if (isDeprecatedBoolean) {
        const maybeMessage =
            typeof isDeprecated === "string" ? (
                <span key="__deprecated_msg" dangerouslySetInnerHTML={dirtyMarkdown(": " + isDeprecated)} />
            ) : (
                ""
            );
        tags.push(propTag(Intent.DANGER, "Deprecated", maybeMessage));
    }
    if (inheritedFrom != null) {
        tags.push(propTag(Intent.NONE, "Inherited from ", <code key="__inherited">{inheritedFrom}</code>));
    }

    const documentation = isTsProperty(prop) ? prop.documentation : prop.signatures[0].documentation;
    // TODO: this ignores tags in prop docs, but that's kind of OK cuz they all get processed
    // into prop.tags by the TS compiler.
    const html =
        documentation && documentation.contents.reduce<string>((a, b) => (typeof b === "string" ? a + b : a), "");

    return (
        <tr key={name}>
            <td className={classes}>
                <code>{name}</code>
            </td>
            <td className="docs-prop-details">
                {renderPropType(prop)}
                <div className="docs-prop-description" dangerouslySetInnerHTML={{ __html: html }} />
                <p className="docs-prop-tags">{tags}</p>
            </td>
        </tr>
    );
}

export interface IInterfaceTableProps {
    iface: ITsClass | ITsInterface;
    tagRenderers: ITagRendererMap;
}

export const InterfaceTable: React.SFC<IInterfaceTableProps> = ({ iface, tagRenderers }) => {
    const propRows = [...iface.properties, ...iface.methods]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(renderPropRow);
    return (
        <div className="docs-modifiers">
            <div className="docs-interface-name">{iface.name}</div>
            {renderBlock(iface.documentation, tagRenderers)}
            <table className="pt-html-table">
                <thead>
                    <tr>
                        <th>Prop</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>{propRows}</tbody>
            </table>
        </div>
    );
};
InterfaceTable.displayName = "Docs.InterfaceTable";
