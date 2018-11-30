/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export const BACKSPACE = 8;
export const TAB = 9;
export const ENTER = 13;
export const SHIFT = 16;
export const ESCAPE = 27;
export const SPACE = 32;
export const ARROW_LEFT = 37;
export const ARROW_UP = 38;
export const ARROW_RIGHT = 39;
export const ARROW_DOWN = 40;
export const DELETE = 46;

/** Returns whether the key code is `enter` or `space`, the two keys that can click a button. */
export function isKeyboardClick(keyCode: number) {
    return keyCode === ENTER || keyCode === SPACE;
}
