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

/**
 * Direction multiplier for component such as radiogroup, tablist
 *
 * @param upMovesLeft
 * If true, up arrow returns same as left arrow, down arrow returns same as right arrow.
 * If false, down arrow returns same as left arrow, up arrow returns same as right arrow.
 * @returns -1 for left, 1 for right, undefined if not an arrow keypress.
 */
export function getArrowKeyDirection(event: React.KeyboardEvent<HTMLElement>, upMovesLeft: boolean = true) {
    const [leftVerticalKey, rightVerticalKey] = upMovesLeft ? ["ArrowUp", "ArrowDown"] : ["ArrowDown", "ArrowUp"];
    if (event.key === "ArrowLeft" || event.key === leftVerticalKey) {
        return -1;
    } else if (event.key === "ArrowRight" || event.key === rightVerticalKey) {
        return 1;
    }
    return undefined;
}
