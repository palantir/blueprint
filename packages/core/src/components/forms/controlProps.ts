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

import type * as React from "react";

import type { Alignment } from "../../common";
import type { HTMLInputProps, Props } from "../../common/props";

export interface CheckedControlProps {
    /** Whether the control is checked. */
    checked?: boolean;

    /** Whether the control is initially checked (uncontrolled mode). */
    defaultChecked?: boolean;

    /** Event handler invoked when input value is changed. */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface ControlProps
    extends CheckedControlProps,
        Props,
        HTMLInputProps,
        React.RefAttributes<HTMLLabelElement> {
    // NOTE: Some HTML props are duplicated here to provide control-specific documentation

    /**
     * Alignment of the indicator within container.
     *
     * @default Alignment.LEFT
     */
    alignIndicator?: Alignment;

    /** JSX label for the control. */
    children?: React.ReactNode;

    /** Whether the control is non-interactive. */
    disabled?: boolean;

    /** Whether the control should appear as an inline element. */
    inline?: boolean;

    /** Ref attached to the HTML `<input>` element backing this component. */
    inputRef?: React.Ref<HTMLInputElement>;

    /**
     * Text label for the control.
     *
     * Use `children` or `labelElement` to supply JSX content. This prop actually supports JSX elements,
     * but TypeScript will throw an error because `HTMLAttributes` only allows strings.
     */
    label?: string;

    /**
     * JSX Element label for the control.
     *
     * This prop is a workaround for TypeScript consumers as the type definition for `label` only
     * accepts strings. JavaScript consumers can provide a JSX element directly to `label`.
     */
    labelElement?: React.ReactNode;

    /** Whether this control should use large styles. */
    large?: boolean;

    /**
     * Name of the HTML tag that wraps the checkbox.
     *
     * By default a `<label>` is used, which effectively enlarges the click
     * target to include all of its children. Supply a different tag name if
     * this behavior is undesirable or you're listening to click events from a
     * parent element (as the label can register duplicate clicks).
     *
     * @default "label"
     */
    tagName?: keyof JSX.IntrinsicElements;
}
