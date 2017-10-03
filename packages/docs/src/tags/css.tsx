/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IKssExample, IKssModifier, IKssPluginData } from "documentalist/dist/client";
import * as React from "react";
import { ModifierTable } from "../components/modifierTable";
import { TagRenderer } from "./";

const MODIFIER_PLACEHOLDER = /\{\{([\.\:]?)modifier\}\}/g;
const DEFAULT_MODIFIER: IKssModifier = {
    documentation: "Default",
    name: "default",
};

const CssExample: React.SFC<IKssExample> = ({ markup, markupHtml, modifiers, reference }) => (
    <div>
        {modifiers.length > 0 ? <ModifierTable modifiers={modifiers} /> : undefined}
        <div className="docs-example-wrapper" data-reference={reference}>
            {renderMarkupForModifier(markup, DEFAULT_MODIFIER)}
            {modifiers.map(mod => renderMarkupForModifier(markup, mod))}
        </div>
        <div className="docs-markup" dangerouslySetInnerHTML={{ __html: markupHtml }} />
    </div>
);

function renderMarkupForModifier(markup: string, modifier: IKssModifier) {
    const { name } = modifier;
    const html = markup.replace(MODIFIER_PLACEHOLDER, (_, prefix) => {
        if (prefix && name.charAt(0) === prefix) {
            return name.slice(1);
        } else if (!prefix) {
            return name;
        } else {
            return "";
        }
    });
    return (
        <div className="docs-example" data-modifier={modifier.name} key={modifier.name}>
            <code>{modifier.name}</code>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}

export class CssTagRenderer {
    constructor(private docs: IKssPluginData) {}

    public render: TagRenderer = ({ value: reference }, key) => {
        const example = this.docs.css[reference];
        if (example === undefined || example.reference === undefined) {
            throw new Error(`Unknown @css reference: ${reference}`);
        }
        return <CssExample {...example} key={key} />;
    };
}
