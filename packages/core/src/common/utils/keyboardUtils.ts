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

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] as const;
type ArrowKey = (typeof ARROW_KEYS)[number];

export function isArrowKey(event: React.KeyboardEvent<HTMLElement>) {
    return ARROW_KEYS.includes(event.key as ArrowKey);
}

/** Direction multiplier */
export function getArrowKeyDirection(
    event: React.KeyboardEvent<HTMLElement>,
    /** Keys that result in a return of -1 */
    negativeKeys: ArrowKey[],
    /** Keys that result in a return of 1 */
    positiveKeys: ArrowKey[],
) {
    if (negativeKeys.includes(event.key as ArrowKey)) {
        return -1 as const;
    } else if (positiveKeys.includes(event.key as ArrowKey)) {
        return 1 as const;
    }
    return undefined;
}
