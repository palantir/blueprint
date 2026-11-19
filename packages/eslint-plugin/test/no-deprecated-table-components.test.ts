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

import { noDeprecatedTableComponentsRule } from "../src/rules/no-deprecated-components";

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
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
        {
            code: dedent`
                import { Table2 } from "@blueprintjs/table";

                return <Table2 numRows={10} />;
            `,
            errors: [
                {
                    messageId: "migration",
                    data: {
                        deprecatedComponentName: "Table2",
                        newComponentName: "Table",
                    },
                },
            ],
        },
        {
            code: dedent`
                import { EditableCell2 } from "@blueprintjs/table";

                return <EditableCell2 value="foo" />;
            `,
            errors: [
                {
                    messageId: "migration",
                    data: {
                        deprecatedComponentName: "EditableCell2",
                        newComponentName: "EditableCell",
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
        {
            code: dedent`
                import { Table } from "@blueprintjs/table";

                return <Table numRows={10} />;
            `,
        },
        {
            code: dedent`
                import { EditableCell } from "@blueprintjs/table";

                return <EditableCell value="foo" />;
            `,
        },
    ],
});
