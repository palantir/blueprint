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

import { Checkbox, Classes, Code } from "@blueprintjs/core";
import { IKssPluginData, ITag } from "@documentalist/client";
import classNames from "classnames";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../common/context";
import { Example } from "../components/example";

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
            <Checkbox
                key={modifier.name}
                checked={this.state.modifiers.has(modifier.name)}
                onChange={this.getModifierToggleHandler(modifier.name)}
            >
                <Code data-modifier={modifier.name}>{modifier.name}</Code>
                <div className="docs-prop-description" dangerouslySetInnerHTML={{ __html: modifier.documentation }} />
            </Checkbox>
        ));
        return (
            <>
                <Example
                    id={reference}
                    options={options.length > 0 ? options : false}
                    html={this.renderExample(markup)}
                />
                <div
                    className={classNames("docs-example-markup", Classes.RUNNING_TEXT)}
                    dangerouslySetInnerHTML={{ __html: markupHtml }}
                />
            </>
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
        return markup.replace(MODIFIER_ATTR_REGEXP, attrs).replace(MODIFIER_CLASS_REGEXP, classes);
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
