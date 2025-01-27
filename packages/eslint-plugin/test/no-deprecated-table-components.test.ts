/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

/* eslint-disable no-template-curly-in-string, sort-keys */

import { RuleTester } from "@typescript-eslint/rule-tester";
import dedent from "dedent";

import { noDeprecatedTableComponentsRule } from "../src/rules/no-deprecated-components";

const ruleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
    },
});

ruleTester.run("no-deprecated-table-components", noDeprecatedTableComponentsRule, {
    invalid: [
        {
            code: dedent`
                import { JSONFormat2 } from "@blueprintjs/table";

                return <JSONFormat2 />;
            `,
            errors: [
                {
                    messageId: "migration",
                    data: {
                        deprecatedComponentName: "JSONFormat2",
                        newComponentName: "JSONFormat",
                    },
                },
            ],
        },
    ],
    valid: [
        {
            code: dedent`
                import { JSONFormat } from "@blueprintjs/table";

                return <JSONFormat />;
            `,
        },
    ],
});
