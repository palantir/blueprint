/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { clamp } from "../../common/utils";

export function clampValue(value: number, min?: number, max?: number) {
    // defaultProps won't work if the user passes in null, so just default
    // to +/- infinity here instead, as a catch-all.
    const adjustedMin = min != null ? min : -Infinity;
    const adjustedMax = max != null ? max : Infinity;
    return clamp(value, adjustedMin, adjustedMax);
}

export function getValueOrEmptyValue(value: number | string = "") {
    return value.toString();
}

/** Returns `true` if the string represents a valid numeric value, like "1e6". */
export function isValueNumeric(value: string) {
    // checking if a string is numeric in Typescript is a big pain, because
    // we can't simply toss a string parameter to isFinite. below is the
    // essential approach that jQuery uses, which involves subtracting a
    // parsed numeric value from the string representation of the value. we
    // need to cast the value to the `any` type to allow this operation
    // between dissimilar types.
    return value != null && (value as any) - parseFloat(value) + 1 >= 0;
}

export function isValidNumericKeyboardEvent(e: React.KeyboardEvent) {
    // unit tests may not include e.key. don't bother disabling those events.
    if (e.key == null) {
        return true;
    }

    // allow modified key strokes that may involve letters and other
    // non-numeric/invalid characters (Cmd + A, Cmd + C, Cmd + V, Cmd + X).
    if (e.ctrlKey || e.altKey || e.metaKey) {
        return true;
    }

    // keys that print a single character when pressed have a `key` name of
    // length 1. every other key has a longer `key` name (e.g. "Backspace",
    // "ArrowUp", "Shift"). since none of those keys can print a character
    // to the field--and since they may have important native behaviors
    // beyond printing a character--we don't want to disable their effects.
    const isSingleCharKey = e.key.length === 1;
    if (!isSingleCharKey) {
        return true;
    }

    // now we can simply check that the single character that wants to be printed
    // is a floating-point number character that we're allowed to print.
    return isFloatingPointNumericCharacter(e.key);
}

/**
 * A regex that matches a string of length 1 (i.e. a standalone character)
 * if and only if it is a floating-point number character as defined by W3C:
 * https://www.w3.org/TR/2012/WD-html-markup-20120329/datatypes.html#common.data.float
 *
 * Floating-point number characters are the only characters that can be
 * printed within a default input[type="number"]. This component should
 * behave the same way when this.props.allowNumericCharactersOnly = true.
 * See here for the input[type="number"].value spec:
 * https://www.w3.org/TR/2012/WD-html-markup-20120329/input.number.html#input.number.attrs.value
 */
const FLOATING_POINT_NUMBER_CHARACTER_REGEX = /^[Ee0-9\+\-\.]$/;
export function isFloatingPointNumericCharacter(character: string) {
    return FLOATING_POINT_NUMBER_CHARACTER_REGEX.test(character);
}

/**
 * Round the value to have _up to_ the specified maximum precision.
 *
 * This differs from `toFixed(5)` in that trailing zeroes are not added on
 * more precise values, resulting in shorter strings.
 */
export function toMaxPrecision(value: number, maxPrecision: number) {
    // round the value to have the specified maximum precision (toFixed is the wrong choice,
    // because it would show trailing zeros in the decimal part out to the specified precision)
    // source: http://stackoverflow.com/a/18358056/5199574
    const scaleFactor = Math.pow(10, maxPrecision);
    return Math.round(value * scaleFactor) / scaleFactor;
}
