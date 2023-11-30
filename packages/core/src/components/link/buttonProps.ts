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

import type { ActionProps } from "../../common";

export interface LinkSharedProps extends ActionProps<HTMLElement> {
    /** Link contents. */
    children?: React.ReactNode;

    /**
     * If set to `true`, the link text element will hide overflow text that does not fit into a
     * single line and show a trailing ellipsis, similar to the `Text` component.
     *
     * @default false
     */
    ellipsizeText?: boolean;

    /** Whether this link should use minimal styles. */
    minimal?: boolean;

    /**
     * HTML `type` attribute of button. Accepted values are `"button"`, `"submit"`, and `"reset"`.
     * Note that this prop has no effect on `AnchorButton`; it only affects `ButtonLink`.
     *
     * @default "button"
     */
    type?: "submit" | "reset" | "button";
}

/**
 * Props interface assignable to both the Link and ButtonLink components.
 *
 * It is useful for the props for the two components to be assignable to each other because the components
 * are so similar and distinguishing between them in their event handlers is usually unnecessary.
 */
export type LinkSharedPropsAndAttributes = LinkSharedProps & React.HTMLAttributes<HTMLElement>;

export type LinkProps = LinkSharedProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
    React.RefAttributes<HTMLAnchorElement>;

export type ButtonLinkProps = LinkSharedProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.RefAttributes<HTMLButtonElement>;
