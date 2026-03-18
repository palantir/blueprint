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

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import {
    type GenerateIsomorphicTestsOptions,
    getComponentNames,
    type IsomorphicTestConfig,
} from "./generateIsomorphicTests.js";

/**
 * Tests that each ComponentClass in Components can be isomorphically rendered on the server.
 *
 * Should be called inside a `describe()` block. The calling test file should use
 * a node environment to simulate a true server environment (no DOM).
 *
 * @param Components Namespace import of all components to test.
 * @param config Configuration per component. This is a mapped type supporting all keys in Components.
 * @param options Test generator options.
 */
export function generateIsomorphicTestsVitest<T extends { [name: string]: any }>(
    Components: T,
    config: { [P in keyof T]?: IsomorphicTestConfig } = {},
    options: GenerateIsomorphicTestsOptions = {},
) {
    function render(name: string, extraProps?: Record<string, unknown>): string {
        const { children, props }: IsomorphicTestConfig = config[name] || {};
        const finalProps = extraProps ? { ...props, ...extraProps } : props;
        // Render to static HTML, just as a server would.
        // We just care that `render()` succeeds: it can be server-rendered.
        return renderToStaticMarkup(createElement(Components[name], finalProps, children));
    }

    getComponentNames(Components, options).forEach(componentName => {
        const { className, skip }: IsomorphicTestConfig = config[componentName] || {};
        if (skip) {
            it.skip(`<${componentName}>`);
            return;
        }

        it(`<${componentName}>`, () => {
            render(componentName);
        });

        if (className === false) {
            it.skip(`<${componentName} className>`);
        } else {
            it(`<${componentName} className>`, () => {
                const testClass = "test-test-test";
                const html = render(componentName, { className: testClass });
                // Verify the class appears exactly once in the rendered HTML.
                const matches = html.match(new RegExp(`\\b${testClass}\\b`, "g"));
                expect(matches).toHaveLength(1);
            });
        }
    });
}
