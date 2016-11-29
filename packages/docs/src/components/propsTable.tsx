/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, Intent, Tag } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { IPropertyEntry } from "ts-quick-docs/src/interfaces";

// HACKHACK support `code` blocks until we get real markdown parsing in ts-quick-docs
function dirtyMarkdown(text: string) {
    return { __html: text.replace("<", "&lt;")
        .replace(/```([^`]+)```/g, (_, code) => `<pre>${code}</pre>`)
        .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`) };
}

const renderPropRow = (prop: IPropertyEntry) => {
    const { deprecated, documentation, inheritedFrom, internal, name, optional } = prop;

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
        tags.push(
            <p key="required"><Tag className={Classes.MINIMAL} intent={Intent.SUCCESS}>Required</Tag></p>,
        );
    }
    if (inheritedFrom != null) {
        tags.push(
            <p key="inherited"><Tag className={Classes.MINIMAL}>Inherited</Tag> from <code>{inheritedFrom}</code></p>,
        );
    }
    if (deprecated) {
        tags.push(
            <p key="deprecated">
                <Tag className={Classes.MINIMAL} intent={Intent.DANGER}>Deprecated</Tag>
                <span dangerouslySetInnerHTML={dirtyMarkdown("" + deprecated)} />
            </p>,
        );
    }

    const formattedType = prop.type.replace("__React", "React").replace(/\b(JSX\.)?Element\b/, "JSX.Element");

    return (
        <tr key={name}>
            <td className={classes}><code>{name}</code></td>
            <td>
                <span className="docs-prop-type pt-monospace-text">{formattedType}</span>
                <span className="docs-prop-default pt-monospace-text">{prop.default}</span>
                <div className="docs-prop-description" dangerouslySetInnerHTML={{ __html: documentation }} />
                {tags}
            </td>
        </tr>
    );
};

export const PropsTable: React.SFC<{ name: string, props: IPropertyEntry[] }> = ({ name, props }) => (
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
