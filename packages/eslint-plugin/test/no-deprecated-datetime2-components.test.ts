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

/* eslint-disable sort-keys */

import { RuleTester } from "@typescript-eslint/rule-tester";
import dedent from "dedent";

import { noDeprecatedDatetime2ComponentsRule } from "../src/rules/no-deprecated-components";

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run("no-deprecated-datetime2-components", noDeprecatedDatetime2ComponentsRule, {
    invalid: [
        {
            code: dedent`
                import { DateInput2 } from "@blueprintjs/datetime2";

                return <DateInput2 />;
            `,
            errors: [
                {
                    messageId: "migration",
                    data: {
                        deprecatedComponentName: "DateInput2",
                        newComponentName: "DateInput",
                    },
                },
            ],
        },
        {
            code: dedent`
                import { DateInput3 } from "@blueprintjs/datetime2";

                return <DateInput3 />;
            `,
            errors: [
                {
                    messageId: "migration",
                    data: {
                        deprecatedComponentName: "DateInput3",
                        newComponentName: "DateInput",
                    },
                },
            ],
        },
    ],
    valid: [
        {
            code: dedent`
                import { DateInput } from "@blueprintjs/datetime";

                return <DateInput />;
            `,
        },
    ],
});
