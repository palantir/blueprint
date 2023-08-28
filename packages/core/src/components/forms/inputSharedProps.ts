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

import type { IconName } from "@blueprintjs/icons";

import type { IntentProps, MaybeElement, Props } from "../../common/props";

/**
 * Shared props interface for text & numeric inputs.
 */
export interface InputSharedProps extends IntentProps, Props {
    /**
     * Whether the input is disabled.
     *
     * Note that `rightElement` must be disabled separately; this prop will not affect it.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Class name to apply to the `<input>` element (not the InputGroup container).
     */
    inputClassName?: string;

    /**
     * Ref attached to the HTML `<input>` element backing this component.
     */
    inputRef?: React.Ref<HTMLInputElement>;

    /**
     * Element to render on the left side of input.
     * This prop is mutually exclusive with `leftIcon`.
     */
    leftElement?: JSX.Element;

    /**
     * Name of a Blueprint UI icon to render on the left side of the input group,
     * before the user's cursor.
     *
     * This prop is mutually exclusive with `leftElement`.
     *
     * Note: setting a JSX.Element here is deprecated; use the `leftElement` prop instead.
     */
    leftIcon?: IconName | MaybeElement;

    /**
     * Placeholder text in the absence of any value.
     */
    placeholder?: string;

    /**
     * Whether the input is read-only.
     *
     * Note that `rightElement` must be disabled or made read-only separately;
     * this prop will not affect it.
     *
     * @default false
     */
    readOnly?: boolean;

    /**
     * Element to render on right side of input.
     * For best results, use a minimal button, tag, or small spinner.
     */
    rightElement?: JSX.Element;
}
