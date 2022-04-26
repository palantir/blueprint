/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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

import { TSESLint } from "@typescript-eslint/utils";
import dedent from "dedent";

import { htmlComponentsRule } from "../src/rules/html-components";

// tslint:disable object-literal-sort-keys

const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
    },
});

console.info("Testing html-components rule...");
ruleTester.run("html-components", htmlComponentsRule, {
    invalid: [
        {
            code: "<h1 />",
            errors: [
                {
                    messageId: "useBlueprintComponents",
                    column: 1,
                    line: 1,
                    data: { componentName: "H1" },
                },
            ],
            output: dedent`
                import { H1 } from "@blueprintjs/core";

                <H1 />
            `,
        },
        {
            code: "<h1>Text</h1>",
            errors: [
                {
                    messageId: "useBlueprintComponents",
                    column: 1,
                    line: 1,
                    data: { componentName: "H1" },
                },
            ],
            output: dedent`
                import { H1 } from "@blueprintjs/core";

                <H1>Text</H1>
            `,
        },
        {
            code: "<pre>block</pre>",
            errors: [
                {
                    messageId: "useBlueprintComponents",
                    column: 1,
                    line: 1,
                    data: { componentName: "Pre" },
                },
            ],
            output: dedent`
                import { Pre } from "@blueprintjs/core";

                <Pre>block</Pre>
            `,
        },
        {
            code: "<table>table element</table>",
            errors: [
                {
                    messageId: "useBlueprintComponents",
                    column: 1,
                    line: 1,
                    data: { componentName: "HTMLTable" },
                },
            ],
            output: dedent`
                import { HTMLTable } from "@blueprintjs/core";

                <HTMLTable>table element</HTMLTable>
            `,
        },
    ],
    valid: ["<div />", "<div></div>", "<H1 />"],
});
