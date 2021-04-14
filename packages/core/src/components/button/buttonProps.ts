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

import type { Alignment, ActionProps, MaybeElement } from "../../common";
import type { IconName } from "../icon/icon";

export type ButtonProps<E extends HTMLButtonElement | HTMLAnchorElement = HTMLButtonElement> = ActionProps &
    React.RefAttributes<E> &
    (E extends HTMLButtonElement
        ? React.ButtonHTMLAttributes<HTMLButtonElement>
        : React.AnchorHTMLAttributes<HTMLAnchorElement>) & {
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

        /** Whether this button should expand to fill its container. */
        fill?: boolean;

        /** Whether this button should use large styles. */
        large?: boolean;

        /**
         * If set to `true`, the button will display a centered loading spinner instead of its contents.
         * The width of the button is not affected by the value of this prop.
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
    };
