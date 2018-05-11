/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Code, Switch } from "@blueprintjs/core";
import { IKssPluginData, ITag } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../common/context";

export interface ICssExampleState {
    modifiers: Set<string>;
}

export class CssExample extends React.PureComponent<ITag> {
    public static contextTypes = DocumentationContextTypes;
    public static displayName = "Docs2.CssExample";

    public context: IDocumentationContext;
    public state: ICssExampleState = { modifiers: new Set<string>() };

    public render() {
        const { value } = this.props;
        const { css } = this.context.getDocsData() as IKssPluginData;
        if (css == null || css[value] == null) {
            return null;
        }
        const { markup, markupHtml, modifiers, reference } = css[value];
        const options = modifiers.map(modifier => (
            <Switch
                key={modifier.name}
                checked={this.state.modifiers.has(modifier.name)}
                onChange={this.getModifierToggleHandler(modifier.name)}
            >
                <Code data-modifier={modifier.name}>{modifier.name}</Code>
                <div className="docs-prop-description" dangerouslySetInnerHTML={{ __html: modifier.documentation }} />
            </Switch>
        ));
        return (
            <div className="docs-example-frame">
                <div className="docs-example-wrapper" data-reference={reference}>
                    <div className="docs-example" dangerouslySetInnerHTML={this.renderExample(markup)} />
                    <div className={Classes.RUNNING_TEXT} dangerouslySetInnerHTML={{ __html: markupHtml }} />
                </div>
                <div className="docs-example-options">{options}</div>
            </div>
        );
    }

    private getModifierToggleHandler(modifier: string) {
        return () => {
            const modifiers = new Set(this.state.modifiers);
            if (modifiers.has(modifier)) {
                modifiers.delete(modifier);
            } else {
                modifiers.add(modifier);
            }
            this.setState({ modifiers });
        };
    }

    private renderExample(markup: string) {
        const classes = this.getModifiers(".");
        const attrs = this.getModifiers(":");
        return { __html: markup.replace(MODIFIER_ATTR_REGEXP, attrs).replace(MODIFIER_CLASS_REGEXP, classes) };
    }

    private getModifiers(prefix: "." | ":") {
        return Array.from(this.state.modifiers.keys())
            .filter(mod => mod.charAt(0) === prefix)
            .map(mod => mod.slice(1))
            .join(" ");
    }
}

const MODIFIER_ATTR_REGEXP = /\{\{:modifier}}/g;
const MODIFIER_CLASS_REGEXP = /\{\{\.modifier}}/g;
