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

// tslint:disable object-literal-sort-keys
/* eslint-disable no-template-curly-in-string */

import { TSESLint } from "@typescript-eslint/utils";
import dedent from "dedent";

import { noDeprecatedComponentsRule } from "../src/rules/no-deprecated-components";

const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
    },
});

console.info("Testing no-deprecated-components rule...");
ruleTester.run("no-deprecated-components", noDeprecatedComponentsRule, {
    invalid: [
        {
            code: dedent`
                import { CollapsibleList } from "@blueprintjs/core";

                return <CollapsibleList />
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedComponentName: "CollapsibleList", newComponentName: "OverflowList" },
                },
            ],
        },
        {
            code: dedent`
                import * as BP from "@blueprintjs/core";

                return <BP.CollapsibleList />
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedComponentName: "CollapsibleList", newComponentName: "OverflowList" },
                },
            ],
        },
        {
            code: dedent`
                import { AbstractComponent } from "@blueprintjs/core";

                export class MyClass extends AbstractComponent {
                }
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedComponentName: "AbstractComponent", newComponentName: "AbstractComponent2" },
                },
            ],
        },
        {
            code: dedent`
                import * as BP from "@blueprintjs/core";

                export class MyClass extends BP.AbstractComponent {
                }
                class MyClass2 extends BP.AbstractComponent {}
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedComponentName: "AbstractComponent", newComponentName: "AbstractComponent2" },
                },
                {
                    messageId: "migration",
                    data: { deprecatedComponentName: "AbstractComponent", newComponentName: "AbstractComponent2" },
                },
            ],
        },
        {
            code: dedent`
                import { TimezonePicker } from "@blueprintjs/timezone";

                return <TimezonePicker />;
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedComponentName: "TimezonePicker", newComponentName: "TimezoneSelect" },
                },
            ],
        },
    ],
    valid: [
        {
            code: dedent`
                import { Button } from "@blueprintjs/core";

                return <Button />
            `,
        },
        {
            code: dedent`
                import { OverflowList } from "@blueprintjs/core";

                return <OverflowList />
            `,
        },
        {
            code: dedent`
                import { OverflowList } from "@blueprintjs/core";

                export class MyList extends OverflowList {}
            `,
        },
        {
            code: dedent`
                import * as BP from "@blueprintjs/core";

                return <BP.Button />
            `,
        },
    ],
});
