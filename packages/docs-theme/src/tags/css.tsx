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

import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";

import { Checkbox, Classes, Code } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";
import { Example } from "../components/example";

import type { CssExampleData } from "./cssExampleTypes";

const MODIFIER_ATTR_REGEXP = /\{\{:modifier}}/g;
const MODIFIER_CLASS_REGEXP = /\{\{\.modifier}}/g;

export interface CssExampleProps {
    data: CssExampleData;
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const CssExample: React.FC<CssExampleProps> = ({ data }) => {
    const [activeModifiers, setActiveModifiers] = useState<Set<string>>(new Set());

    const getModifiers = useCallback(
        (prefix: "." | ":") => {
            return Array.from(activeModifiers.keys())
                .filter(mod => mod.charAt(0) === prefix)
                .map(mod => mod.slice(1))
                .join(" ");
        },
        [activeModifiers],
    );

    const getModifierToggleHandler = (modifier: string) => {
        return () => {
            const newModifiers = new Set(activeModifiers);
            if (newModifiers.has(modifier)) {
                newModifiers.delete(modifier);
            } else {
                newModifiers.add(modifier);
            }
            setActiveModifiers(newModifiers);
        };
    };

    const { markup, modifiers, reference } = data;
    const markupHtml = useMemo(() => `<pre><code>${escapeHtml(markup)}</code></pre>`, [markup]);

    const options = modifiers.map(modifier => (
        <Checkbox
            key={modifier.name}
            checked={activeModifiers.has(modifier.name)}
            onChange={getModifierToggleHandler(modifier.name)}
        >
            <Code data-modifier={modifier.name}>{modifier.name}</Code>
            <div className="docs-prop-description" dangerouslySetInnerHTML={{ __html: modifier.documentation }} />
        </Checkbox>
    ));

    const classModifiers = getModifiers(".");
    const attrModifiers = getModifiers(":");
    const exampleHtml = markup
        .replace(MODIFIER_ATTR_REGEXP, attrModifiers)
        .replace(MODIFIER_CLASS_REGEXP, classModifiers);

    return (
        <>
            <Example id={reference} options={options.length > 0 ? options : false} html={exampleHtml} />
            <div
                className={classNames("docs-example-markup", Classes.RUNNING_TEXT)}
                dangerouslySetInnerHTML={{ __html: markupHtml }}
            />
        </>
    );
};
CssExample.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.CssExample`;
