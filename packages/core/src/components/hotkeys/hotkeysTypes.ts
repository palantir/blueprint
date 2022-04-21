/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import { Props } from "../../common";

export interface IHotkeysProps extends Props {
    /** Hotkey elements. */
    children?: React.ReactNode;

    /**
     * In order to make local hotkeys work on elements that are not normally
     * focusable, such as `<div>`s or `<span>`s, we add a `tabIndex` attribute
     * to the hotkey target, which makes it focusable. By default, we use `0`,
     * but you can override this value to change the tab navigation behavior
     * of the component. You may even set this value to `null`, which will omit
     * the `tabIndex` from the component decorated by `HotkeysTarget`.
     */
    tabIndex?: number;
}
