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

import type { Position, Props } from "../../common";

export type ToasterPosition =
    | typeof Position.TOP
    | typeof Position.TOP_LEFT
    | typeof Position.TOP_RIGHT
    | typeof Position.BOTTOM
    | typeof Position.BOTTOM_LEFT
    | typeof Position.BOTTOM_RIGHT;

/**
 * Props supported by the `<OverlayToaster>` component.
 * These props can be passed as an argument to the static `Toaster.create(props?, container?)` method.
 */
export interface OverlayToasterProps extends Props {
    /**
     * Whether a toast should acquire application focus when it first opens.
     * This is disabled by default so that toasts do not interrupt the user's flow.
     * Note that `enforceFocus` is always disabled for `Toaster`s.
     *
     * @default false
     */
    autoFocus?: boolean;

    /**
     * Whether pressing the `esc` key should clear all active toasts.
     *
     * @default true
     */
    canEscapeKeyClear?: boolean;

    /** Toasts to display inside the Overlay. */
    children?: React.ReactNode;

    /**
     * Whether the toaster should be rendered into a new element attached to `document.body`.
     * If `false`, then positioning will be relative to the parent element.
     *
     * This prop is ignored by `Toaster.create()` as that method always appends a new element
     * to the container.
     *
     * @default true
     */
    usePortal?: boolean;

    /**
     * Position of `Toaster` within its container.
     *
     * @default Position.TOP
     */
    position?: ToasterPosition;

    /**
     * The maximum number of active toasts that can be displayed at once.
     *
     * When the limit is about to be exceeded, the oldest active toast is removed.
     *
     * @default undefined
     */
    maxToasts?: number;
}
