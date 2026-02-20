/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { AnchorButton, Code, Intent } from "@blueprintjs/core";
import { propsRegistry } from "@blueprintjs/docs-data";
import { PropsTable } from "@blueprintjs/docs-theme";
import { Code as CodeIcon } from "@blueprintjs/icons";

import { reactExamples } from "../tags/reactExamples";

/**
 * Bridge component: looks up propsRegistry by name and renders a PropsTable.
 */
function InterfaceTable({ name }: { name: string }) {
    const info = propsRegistry[name];
    if (info == null) {
        return (
            <div className="bp5-callout bp5-intent-warning">
                <Code>{name}</Code> not found in propsRegistry.
            </div>
        );
    }
    return <PropsTable name={info.name} description={info.description} filePath={info.filePath} props={info.props} />;
}

/**
 * Bridge component: renders a code example by name (no source link).
 */
function ReactCodeExample({ name }: { name: string }) {
    const example = reactExamples[name];
    if (example == null) {
        return (
            <div className="bp5-callout bp5-intent-warning">
                Unknown example: <Code>{name}</Code>
            </div>
        );
    }
    return example.render({ id: name }) ?? null;
}

/**
 * Bridge component: renders an interactive example with "View source on GitHub" link.
 */
function ReactExample({ name }: { name: string }) {
    const example = reactExamples[name];
    if (example == null) {
        return (
            <div className="bp5-callout bp5-intent-warning">
                Unknown example: <Code>{name}</Code>
            </div>
        );
    }
    return (
        <>
            {example.render({ id: name })}
            <AnchorButton
                className="docs-example-view-source"
                fill={true}
                href={example.sourceUrl}
                icon={<CodeIcon />}
                intent={Intent.PRIMARY}
                target="_blank"
                text="View source on GitHub"
                variant="minimal"
            />
        </>
    );
}

/** Component map for MDXProvider. */
export const mdxComponents = {
    InterfaceTable,
    ReactCodeExample,
    ReactExample,
};
