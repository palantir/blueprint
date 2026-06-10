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

import { noDeprecatedCoreComponentsRule } from "../src/rules/no-deprecated-components";

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run("no-deprecated-core-components", noDeprecatedCoreComponentsRule, {
    invalid: [
        {
            code: dedent`
                import { HotkeysTarget2, Overlay, PanelStack2, Popover, Toast2 } from "@blueprintjs/core";

                return (
                    <>
                        <HotkeysTarget2 />
                        <Overlay />
                        <PanelStack2 />
                        <Popover />
                        <Toast2 />
                    </>
                );
            `,
            errors: [
                {
                    data: {
                        deprecatedComponentName: "HotkeysTarget2",
                        newComponentName: "HotkeysTarget",
                    },
                    messageId: "migration",
                },
                {
                    data: {
                        deprecatedComponentName: "Overlay",
                        newComponentName: "Overlay2",
                    },
                    messageId: "migration",
                },
                {
                    data: {
                        deprecatedComponentName: "PanelStack2",
                        newComponentName: "PanelStack",
                    },
                    messageId: "migration",
                },
                {
                    data: {
                        deprecatedComponentName: "Popover",
                        newComponentName: "PopoverNext",
                    },
                    messageId: "migration",
                },
                {
                    data: {
                        deprecatedComponentName: "Toast2",
                        newComponentName: "Toast",
                    },
                    messageId: "migration",
                },
            ],
        },
        {
            code: dedent`
                import * as Blueprint from "@blueprintjs/core";

                return (
                    <>
                        <Blueprint.HotkeysTarget2 />
                        <Blueprint.Overlay />
                        <Blueprint.PanelStack2 />
                        <Blueprint.Popover />
                        <Blueprint.Toast2 />
                    </>
                );
            `,
            errors: [
                {
                    data: {
                        deprecatedComponentName: "HotkeysTarget2",
                        newComponentName: "HotkeysTarget",
                    },
                    messageId: "migration",
                },
                {
                    data: {
                        deprecatedComponentName: "Overlay",
                        newComponentName: "Overlay2",
                    },
                    messageId: "migration",
                },
                {
                    data: {
                        deprecatedComponentName: "PanelStack2",
                        newComponentName: "PanelStack",
                    },
                    messageId: "migration",
                },
                {
                    data: {
                        deprecatedComponentName: "Popover",
                        newComponentName: "PopoverNext",
                    },
                    messageId: "migration",
                },
                {
                    data: {
                        deprecatedComponentName: "Toast2",
                        newComponentName: "Toast",
                    },
                    messageId: "migration",
                },
            ],
        },
    ],
    valid: [
        {
            code: dedent`
                import { MenuItem } from "@blueprintjs/core";

                return <MenuItem text="Open in new tab" icon="share" />
            `,
        },
        {
            code: dedent`
                import * as Blueprint from "@blueprintjs/core";

                return <Blueprint.MenuItem text="Open in new tab" icon="share" />
            `,
        },
        {
            code: dedent`
                import { MenuItem } from "@blueprintjs/core";

                return <MenuItem popoverProps={{ boundary: "window" }} />
            `,
        },
        {
            code: dedent`
                import * as Blueprint from "@blueprintjs/core";

                return <Blueprint.MenuItem popoverProps={{ boundary: "window" }} />
            `,
        },
    ],
});
