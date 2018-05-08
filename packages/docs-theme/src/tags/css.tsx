/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Code } from "@blueprintjs/core";
import { IKssPluginData, ITag } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../common/context";
import { ModifierTable } from "../components/modifierTable";

export class CssExample extends React.PureComponent<ITag> {
    public static contextTypes = DocumentationContextTypes;
    public static displayName = "Docs2.CssExample";

    public context: IDocumentationContext;

    public render() {
        const { value } = this.props;
        const { css } = this.context.getDocsData() as IKssPluginData;
        if (css == null || css[value] == null) {
            return null;
        }
        const { markup, markupHtml, modifiers, reference } = css[value];
        const examples = modifiers.map(modifier => (
            <tr key={modifier.name}>
                <td data-modifier={modifier.name}>
                    <Code>{modifier.name}</Code>
                </td>
                <td className="docs-prop-description" dangerouslySetInnerHTML={{ __html: modifier.documentation }} />
            </tr>
        ));
        return (
            <div>
                {examples.length > 0 && <ModifierTable title="Modifiers">{examples}</ModifierTable>}
                <div className="docs-example-wrapper" data-reference={reference}>
                    {this.renderMarkupExample(markup)}
                    {modifiers.map(mod => this.renderMarkupExample(markup, mod.name))}
                </div>
                <div className={Classes.RUNNING_TEXT} dangerouslySetInnerHTML={{ __html: markupHtml }} />
            </div>
        );
    }

    private renderMarkupExample(markup: string, modifierName = "default") {
        return (
            <div className="docs-example" data-modifier={modifierName} key={modifierName}>
                <Code>{modifierName}</Code>
                {this.renderMarkupForModifier(markup, modifierName)}
            </div>
        );
    }

    private renderMarkupForModifier(markup: string, modifierName: string) {
        const html = markup.replace(MODIFIER_PLACEHOLDER_REGEXP, (_, prefix: string) => {
            if (prefix && modifierName.charAt(0) === prefix) {
                return modifierName.slice(1);
            } else if (!prefix) {
                return modifierName;
            } else {
                return "";
            }
        });
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
}

const MODIFIER_PLACEHOLDER_REGEXP = /\{\{([.:]?)modifier\}\}/g;
