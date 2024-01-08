/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

export * from "./compareUtils";
export {
    clickElementOnKeyPress,
    elementIsOrContains,
    elementIsTextInput,
    getActiveElement,
    throttle,
    throttleEvent,
    throttleReactEventCallback,
} from "./domUtils";
export { isFunction } from "./functionUtils";
export * from "./jsUtils";
export * from "./reactUtils";
export { isArrowKey, isKeyboardClick } from "./keyboardUtils";
export type { Extends } from "./typeUtils";
export { isDarkTheme } from "./isDarkTheme";

// ref utils used to live in this folder, but got refactored and moved elsewhere.
// we keep this export here for backwards compatibility
export { setRef, getRef } from "../refs";
