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

import { noDeprecatedTypeReferencesRule } from "../src/rules/no-deprecated-type-references";

const ruleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
    },
});

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

        // N.B. it is difficult to test fixes of multiple violations with ESLint's RuleTester,
        // see https://github.com/eslint/eslint/issues/11187#issuecomment-470990425
        {
            code: dedent`
                import { ISelectProps } from "@blueprintjs/select";
                const mySelectProps: ISelectProps = { items: [] };
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "ISelectProps", newTypeName: "SelectProps" },
                },
            ],
            output: dedent`
                import { SelectProps } from "@blueprintjs/select";
                const mySelectProps: SelectProps = { items: [] };
            `,
        },

        // Ensure that multiple references/uses of the _same_ deprecated type are all fixed
        {
            code: dedent`
                import { ItemRenderer, IItemRendererProps } from "@blueprintjs/select";
                const fooRenderer: ItemRenderer<any> = (item: any, props: IItemRendererProps) => {
                    return "foo";
                }
                const barRenderer: ItemRenderer<any> = (item: any, props: IItemRendererProps) => {
                    return "bar";
                }
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "IItemRendererProps", newTypeName: "ItemRendererProps" },
                },
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "IItemRendererProps", newTypeName: "ItemRendererProps" },
                },
            ],
            output: dedent`
                import { ItemRenderer, ItemRendererProps } from "@blueprintjs/select";
                const fooRenderer: ItemRenderer<any> = (item: any, props: ItemRendererProps) => {
                    return "foo";
                }
                const barRenderer: ItemRenderer<any> = (item: any, props: ItemRendererProps) => {
                    return "bar";
                }
            `,
        },
        {
            code: dedent`
                import { Button, IButtonProps } from "@blueprintjs/core";
                const ButtonAlias = (props: IButtonProps) => <Button {...props} />;
                interface MyButtonProps extends IButtonProps {
                    type: string;
                }
                const MyButton = (props: MyButtonProps) => <Button {...props} />;
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "IButtonProps", newTypeName: "ButtonProps" },
                },
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "IButtonProps", newTypeName: "ButtonProps" },
                },
            ],
            output: dedent`
                import { Button, ButtonProps } from "@blueprintjs/core";
                const ButtonAlias = (props: ButtonProps) => <Button {...props} />;
                interface MyButtonProps extends ButtonProps {
                    type: string;
                }
                const MyButton = (props: MyButtonProps) => <Button {...props} />;
            `,
        },

        // dealing with name conflicts which require import aliases
        {
            code: dedent`
                import { IProps } from "@blueprintjs/core";

                export interface Props extends IProps {
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
                import { Props as BlueprintProps } from "@blueprintjs/core";

                export interface Props extends BlueprintProps {
                    foo: string;
                }
            `,
        },
        {
            code: dedent`
                import { IProps } from "@blueprintjs/core";

                export namespace MyComponent {
                    export interface Props extends IProps {
                        foo: string;
                    }
                }
            `,
            errors: [
                {
                    messageId: "migration",
                    data: { deprecatedTypeName: "IProps", newTypeName: "Props" },
                },
            ],
            output: dedent`
                import { Props as BlueprintProps } from "@blueprintjs/core";

                export namespace MyComponent {
                    export interface Props extends BlueprintProps {
                        foo: string;
                    }
                }
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
