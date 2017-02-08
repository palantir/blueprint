/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, Intent, Tag } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { IInheritedPropertyEntry } from "../common/propsStore";

// HACKHACK support `code` blocks until we get real markdown parsing in ts-quick-docs
function dirtyMarkdown(text: string) {
    return { __html: text.replace("<", "&lt;")
        .replace(/```([^`]+)```/g, (_, code) => `<pre>${code}</pre>`)
        .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`) };
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
        const maybeMessage = typeof deprecated === "string"
            ? <span dangerouslySetInnerHTML={dirtyMarkdown(": " + deprecated)} />
            : undefined;
        tags.push(propTag(Intent.DANGER, "Deprecated", maybeMessage));
    }
    if (inheritedFrom != null) {
        tags.push(propTag(Intent.NONE, "Inherited", " from ", <code>{inheritedFrom}</code>));
    }

    const formattedType = prop.type.replace("__React", "React").replace(/\b(JSX\.)?Element\b/, "JSX.Element");

    return (
        <tr key={name}>
            <td className={classes}><code>{name}</code></td>
            <td>
                <strong className="docs-prop-type pt-monospace-text">{formattedType}</strong>
                <em className="docs-prop-default pt-text-muted pt-monospace-text">{defaultValue}</em>
                <div className="docs-prop-description" dangerouslySetInnerHTML={{ __html: documentation }} />
                <p className="docs-prop-tags">{tags}</p>
            </td>
        </tr>
    );
};

export const PropsTable: React.SFC<{ name: string, props: IInheritedPropertyEntry[] }> = ({ name, props }) => (
    <div className="kss-modifiers">
        <div className="docs-interface-name">{name}</div>
        <table className="pt-table">
            <thead>
                <tr>
                    <th>Prop</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {props.map(renderPropRow)}
            </tbody>
        </table>
    </div>
);
PropsTable.displayName = "Docs.PropsTable";
