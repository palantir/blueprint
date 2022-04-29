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

import { iconComponentsRule, OPTION_COMPONENT, OPTION_LITERAL } from "../src/rules/icon-components";

// tslint:disable object-literal-sort-keys

const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
});

console.info("Testing icon-components rule...");
ruleTester.run("icon-components", iconComponentsRule, {
    invalid: [
        {
            code: `<Button icon="tick" />`,
            errors: [
                {
                    messageId: OPTION_COMPONENT,
                    column: 9,
                    line: 1,
                    data: { [OPTION_COMPONENT]: "<TickIcon />" },
                },
            ],
            output: `<Button icon={<TickIcon />} />`,
        },
        {
            code: `<Button icon="tick" />`,
            errors: [
                {
                    messageId: OPTION_COMPONENT,
                    column: 9,
                    line: 1,
                    data: { [OPTION_COMPONENT]: "<TickIcon />" },
                },
            ],
            options: [OPTION_COMPONENT],
            output: `<Button icon={<TickIcon />} />`,
        },
        {
            code: `<Button icon={<TickIcon />} />`,
            errors: [
                {
                    messageId: OPTION_LITERAL,
                    column: 9,
                    line: 1,
                    data: { [OPTION_LITERAL]: `"tick"` },
                },
            ],
            options: [OPTION_LITERAL],
            output: `<Button icon="tick" />`,
        },
    ],
    valid: [
        {
            code: `<Button icon="tick" />`,
            options: [OPTION_LITERAL],
        },

        {
            code: `<Button icon={<TickIcon />} />`,
            options: [OPTION_COMPONENT],
        },
        {
            code: `<InputGroup rightElement={<Button />} />`,
            options: [OPTION_LITERAL],
        },
    ],
});
