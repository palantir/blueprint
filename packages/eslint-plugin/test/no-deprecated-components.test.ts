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

import { RuleTester } from "@typescript-eslint/rule-tester";
import dedent from "dedent";

import { noDeprecatedComponentsRule } from "../src/rules/no-deprecated-components";

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run("no-deprecated-components", noDeprecatedComponentsRule, {
    invalid: [
        {
            code: dedent`
                import { Popover } from "@blueprintjs/core";

                return <Popover />;
            `,
            errors: [
                {
                    data: {
                        deprecatedComponentName: "Popover",
                        newComponentName: "PopoverNext",
                    },
                    messageId: "migration",
                },
            ],
        },
        {
            code: dedent`
                import { Popover as BlueprintPopover } from "@blueprintjs/core";

                return <BlueprintPopover />;
            `,
            errors: [
                {
                    data: {
                        deprecatedComponentName: "Popover",
                        newComponentName: "PopoverNext",
                    },
                    messageId: "migration",
                },
            ],
        },
        {
            code: dedent`
                import * as Blueprint from "@blueprintjs/core";

                return <Blueprint.Popover />;
            `,
            errors: [
                {
                    data: {
                        deprecatedComponentName: "Popover",
                        newComponentName: "PopoverNext",
                    },
                    messageId: "migration",
                },
            ],
        },
        {
            code: dedent`
                import { Popover as BlueprintPopover } from "@blueprintjs/core";

                export class MyPopover extends BlueprintPopover {}
            `,
            errors: [
                {
                    data: {
                        deprecatedComponentName: "Popover",
                        newComponentName: "PopoverNext",
                    },
                    messageId: "migration",
                },
            ],
        },
        {
            code: dedent`
                import { Select2 as BlueprintSelect } from "@blueprintjs/select";

                BlueprintSelect.ofType<string>();
            `,
            errors: [
                {
                    data: {
                        deprecatedComponentName: "Select2",
                        newComponentName: "Select",
                    },
                    messageId: "migration",
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
        {
            code: dedent`
                import { CollapsibleList } from "@blueprintjs/core";

                return <CollapsibleList />
            `,
        },
        {
            code: dedent`
                import * as BP from "@blueprintjs/core";

                return <BP.CollapsibleList />
            `,
        },
        {
            code: dedent`
                import { AbstractComponent } from "@blueprintjs/core";

                export class MyClass extends AbstractComponent {
                }
            `,
        },
        {
            code: dedent`
                import * as BP from "@blueprintjs/core";

                export class MyClass extends BP.AbstractComponent {
                }
                class MyClass2 extends BP.AbstractComponent {}
            `,
        },
    ],
});
