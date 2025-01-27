/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { noDeprecatedDatetimeComponentsRule } from "../src/rules/no-deprecated-components";

const ruleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
    },
});

ruleTester.run("no-deprecated-datetime-components", noDeprecatedDatetimeComponentsRule, {
    invalid: [
        {
            code: dedent`
                import { DatePicker } from "@blueprintjs/datetime";

                return <DatePicker />;
            `,
            errors: [
                {
                    messageId: "migration",
                    data: {
                        deprecatedComponentName: "DatePicker",
                        newComponentName: "DatePicker3",
                    },
                },
            ],
        },
    ],
    valid: [
        {
            code: dedent`
                import { DatePicker3 } from "@blueprintjs/datetime2";

                return <DatePicker3 />;
            `,
        },
    ],
});
