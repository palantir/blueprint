/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IKssModifier, IKssPluginData, ITag } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../common/context";
import { ModifierTable } from "../components/modifierTable";

export const CssExample: React.SFC<ITag> = ({ value }, { getDocsData }: IDocumentationContext) => {
    const { css } = getDocsData() as IKssPluginData;
    if (css == null || css[value] == null) {
        return null;
    }
    const { markup, markupHtml, modifiers, reference } = css[value];
    return (
        <div>
            {modifiers.length > 0 ? <ModifierTable modifiers={modifiers} /> : undefined}
            <div className="docs-example-wrapper" data-reference={reference}>
                {renderMarkupForModifier(markup, DEFAULT_MODIFIER)}
                {modifiers.map(mod => renderMarkupForModifier(markup, mod))}
            </div>
            <div className="docs-markup" dangerouslySetInnerHTML={{ __html: markupHtml }} />
        </div>
    );
};
CssExample.contextTypes = DocumentationContextTypes;
CssExample.displayName = "Docs.CssExample";

function renderMarkupForModifier(markup: string, { name }: IKssModifier) {
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
        <div className="docs-example" data-modifier={name} key={name}>
            <code>{name}</code>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}

const MODIFIER_PLACEHOLDER = /\{\{([.:]?)modifier\}\}/g;
const DEFAULT_MODIFIER: IKssModifier = {
    documentation: "Default",
    name: "default",
};
