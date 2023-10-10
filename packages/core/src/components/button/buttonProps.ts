/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import type * as React from "react";

import type { ActionProps, Alignment, MaybeElement } from "../../common";
import type { IconName } from "../icon/icon";

export interface ButtonSharedProps extends ActionProps<HTMLElement> {
    /**
     * If set to `true`, the button will display in an active state.
     * This is equivalent to setting `className={Classes.ACTIVE}`.
     *
     * @default false
     */
    active?: boolean;

    /**
     * Text alignment within button. By default, icons and text will be centered
     * within the button. Passing `"left"` or `"right"` will align the button
     * text to that side and push `icon` and `rightIcon` to either edge. Passing
     * `"center"` will center the text and icons together.
     *
     * @default Alignment.CENTER
     */
    alignText?: Alignment;

    /** Button contents. */
    children?: React.ReactNode;

    /** Whether this button should expand to fill its container. */
    fill?: boolean;

    /** Whether this button should use large styles. */
    large?: boolean;

    /**
     * If set to `true`, the button will display a centered loading spinner instead of its contents
     * and the button will be disabled (_even if_ `disabled={false}`). The width of the button is
     * not affected by the value of this prop.
     *
     * @default false
     */
    loading?: boolean;

    /** Whether this button should use minimal styles. */
    minimal?: boolean;

    /** Whether this button should use outlined styles. */
    outlined?: boolean;

    /** Name of a Blueprint UI icon (or an icon element) to render after the text. */
    rightIcon?: IconName | MaybeElement;

    /** Whether this button should use small styles. */
    small?: boolean;

    /**
     * HTML `type` attribute of button. Accepted values are `"button"`, `"submit"`, and `"reset"`.
     * Note that this prop has no effect on `AnchorButton`; it only affects `Button`.
     *
     * @default "button"
     */
    type?: "submit" | "reset" | "button";
}

/**
 * Props interface assignable to both the Button and AnchorButton components.
 *
 * It is useful for the props for the two components to be assignable to each other because the components
 * are so similar and distinguishing between them in their event handlers is usually unnecessary.
 */
export type ButtonSharedPropsAndAttributes = ButtonSharedProps & React.HTMLAttributes<HTMLElement>;

export type ButtonProps = ButtonSharedProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.RefAttributes<HTMLButtonElement>;

export type AnchorButtonProps = ButtonSharedProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
    React.RefAttributes<HTMLAnchorElement>;
