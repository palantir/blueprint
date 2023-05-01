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

/**
 * Returns whether the keyboard event was triggered by Enter or Space, the two keys that are expected to trigger
 * interactive elements like buttons.
 */
export function isKeyboardClick(event: React.KeyboardEvent<HTMLElement>) {
    return event.key === "Enter" || event.key === " ";
}

export function isArrowKey(event: React.KeyboardEvent<HTMLElement>) {
    return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.key) >= 0;
}
