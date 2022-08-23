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

import { noDeprecatedTypeReferencesRule } from "../src/rules/no-deprecated-type-references";

const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
    },
});

console.info("Testing no-deprecated-type-references rule...");
ruleTester.run("no-deprecated-type-references", noDeprecatedTypeReferencesRule, {
    invalid: [
        {
            code: dedent`
                import { IProps } from "@blueprintjs/core";

                export interface MyInterface extends IProps {
                    foo: string;
                }
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "IProps", newTypeName: "Props" },
                },
            ],
            output: dedent`
                import { Props } from "@blueprintjs/core";

                export interface MyInterface extends Props {
                    foo: string;
                }
            `,
        },
        {
            code: dedent`
                import * as Blueprint from "@blueprintjs/core";

                export interface MyInterface extends Blueprint.IProps {
                    foo: string;
                }
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "IProps", newTypeName: "Props" },
                },
            ],
            output: dedent`
                import * as Blueprint from "@blueprintjs/core";

                export interface MyInterface extends Blueprint.Props {
                    foo: string;
                }
            `,
        },
        {
            code: dedent`
                import { MenuItem } from "@blueprintjs/core";
                import { IItemRendererProps } from "@blueprintjs/select";

                export const defaultRenderMenuItem = (_item: any, { handleClick, modifiers }: IItemRendererProps) => {
                    return <MenuItem {...modifiers} onClick={handleClick} />;
                };
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "IItemRendererProps", newTypeName: "ItemRendererProps" },
                },
            ],
            output: dedent`
                import { MenuItem } from "@blueprintjs/core";
                import { ItemRendererProps } from "@blueprintjs/select";

                export const defaultRenderMenuItem = (_item: any, { handleClick, modifiers }: ItemRendererProps) => {
                    return <MenuItem {...modifiers} onClick={handleClick} />;
                };
            `,
        },
        {
            code: dedent`
                import { ISelectProps, Select } from "@blueprintjs/select";
                import { ITimezoneItem } from "@blueprintjs/timezone";

                const MySelect = Select.ofType<ITimezoneItem>();
                const mySelectProps: ISelectProps = { items: [] };
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "ITimezoneItem", newTypeName: "TimezoneItem" },
                },
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "ISelectProps", newTypeName: "SelectProps" },
                },
            ],
            output: dedent`
                import { SelectProps, Select } from "@blueprintjs/select";
                import { TimezoneItem } from "@blueprintjs/timezone";

                const MySelect = Select.ofType<TimezoneItem>();
                const mySelectProps: SelectProps = { items: [] };
            `,
        },
    ],
    valid: [
        {
            code: dedent`
                import { ButtonProps } from "@blueprintjs/core";

                function MyButton(_props: ButtonProps) {
                    return <button />;
                }
            `,
        },
    ],
});
