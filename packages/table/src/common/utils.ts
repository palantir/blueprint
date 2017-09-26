/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps, Utils as CoreUtils } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

/**
 * Re-declare matching types from the classnames library;
 */
export type ClassValue = string | number | ClassDictionary | ClassArray;

// tslint:disable interface-name no-empty-interface
export interface ClassDictionary {
    [id: string]: boolean;
}

export interface ClassArray extends Array<ClassValue> {}
// tslint:enable

export interface ICssFontProperties {
    "font-family"?: string;
    "font-size"?: string;
    "font-style"?: string;
    "font-variant"?: string;
    "font-weight"?: string;
}

/**
 * Since Firefox doesn't provide a computed "font" property, we manually
 * construct it using the ordered properties that can be specifed in CSS.
 */
const CSS_FONT_PROPERTIES: Array<keyof ICssFontProperties> = [
    "font-style",
    "font-variant",
    "font-weight",
    "font-size",
    "font-family",
];

// the functions using these interfaces now live in core. it's not clear how to
// import interfaces from core and re-export them here, so just redefine them.
export interface IKeyWhitelist<T> {
    include: Array<keyof T>;
}
export interface IKeyBlacklist<T> {
    exclude: Array<keyof T>;
}

let _CANVAS_SINGLETON: HTMLCanvasElement;
function _getSingletonCanvasContext(): CanvasRenderingContext2D {
    if (_CANVAS_SINGLETON == null) {
        _CANVAS_SINGLETON = document.createElement("canvas");
    }
    return _CANVAS_SINGLETON.getContext("2d");
}

export const Utils = {
    /**
     * Returns a clone of the ReactElement with a className that includes the
     * element's original className and any other classes passed in with variadic
     * arguments matching the `classNames` api.
     */
    assignClasses<P extends IProps>(elem: React.ReactElement<P>, ...extendedClasses: ClassValue[]) {
        const classes = classNames(elem.props.className, ...extendedClasses);
        return React.cloneElement(elem, { className: classes } as IProps);
    },

    /**
     * Invokes the callback `n` times, collecting the results in an array, which
     * is the return value. Similar to _.times
     */
    times<T>(n: number, callback: (i: number) => T): T[] {
        const result: T[] = Array(n);
        for (let index = 0; index < n; index++) {
            result[index] = callback(index);
        }
        return result;
    },

    /**
     * Takes an array of numbers, returns an array of numbers of the same length in which each
     * value is the sum of current and previous values in the input array.
     *
     * Example input:  [10, 20, 50]
     *         output: [10, 30, 80]
     */
    accumulate(numbers: number[]) {
        const result: number[] = [];
        let sum = 0;
        for (const num of numbers) {
            sum += num;
            result.push(sum);
        }
        return result;
    },

    /**
     * Returns traditional spreadsheet-style column names
     * e.g. (A, B, ..., Z, AA, AB, ..., ZZ, AAA, AAB, ...).
     *
     * Note that this isn't technically mathematically equivalent to base 26 since
     * there is no zero element.
     */
    toBase26Alpha(num: number) {
        let str = "";
        while (true) {
            const letter = num % 26;
            str = String.fromCharCode(65 + letter) + str;
            num = num - letter;
            if (num <= 0) {
                return str;
            }
            num = num / 26 - 1;
        }
    },

    /**
     * Returns traditional spreadsheet-style cell names
     * e.g. (A1, B2, ..., Z44, AA1) with rows 1-indexed.
     */
    toBase26CellName(rowIndex: number, columnIndex: number) {
        return `${Utils.toBase26Alpha(columnIndex)}${rowIndex + 1}`;
    },

    /**
     * Performs the binary search algorithm to find the index of the `value`
     * parameter in a sorted list of numbers. If `value` is not in the list, the
     * index where `value` can be inserted to maintain the sort is returned.
     *
     * Unlike a typical binary search implementation, we use a `lookup`
     * callback to access the sorted list of numbers instead of an array. This
     * avoids additional storage overhead.
     *
     * We use this to, for example, find the index of a row/col given its client
     * coordinate.
     *
     * Adapted from lodash https://github.com/lodash/lodash/blob/4.11.2/lodash.js#L3579
     *
     * @param value - the query value
     * @param high - the length of the sorted list of numbers
     * @param lookup - returns the number from the list at the supplied index
     */
    binarySearch(value: number, high: number, lookup: (index: number) => number): number {
        let low = 0;
        while (low < high) {
            const mid = Math.floor((low + high) / 2.0);
            const computed = lookup(mid);
            if (computed < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return high;
    },

    /**
     * Returns a copy of the array that will have a length of the supplied parameter.
     * If the array is too long, it will be truncated. If it is too short, it will be
     * filled with the suppleid `fillValue` argument.
     *
     * @param array - the `Array` to copy and adjust
     * @param length - the target length of the array
     * @param fillValue - the value to add to the array if it is too short
     */
    arrayOfLength<T>(array: T[], length: number, fillValue: T): T[] {
        if (array.length > length) {
            return array.slice(0, length);
        }

        array = array.slice();
        while (array.length < length) {
            array.push(fillValue);
        }
        return array;
    },

    /**
     * Takes in one full array of values and one sparse array of the same
     * length and type. Returns a copy of the `defaults` array, where each
     * value is replaced with the corresponding non-null value at the same
     * index in `sparseOverrides`.
     *
     * @param defaults - the full array of default values
     * @param sparseOverrides - the sparse array of override values
     */
    assignSparseValues<T>(defaults: T[], sparseOverrides: T[]) {
        if (sparseOverrides == null || defaults.length !== sparseOverrides.length) {
            return defaults;
        }

        defaults = defaults.slice();
        for (let i = 0; i < defaults.length; i++) {
            const override = sparseOverrides[i];
            if (override != null) {
                defaults[i] = override;
            }
        }
        return defaults;
    },

    /**
     * Measures the bounds of supplied element's textContent assuming no
     * text wrapping.
     *
     * To improve performance, provide the `fontProperties` parameter. Otherwise,
     * we use the computed font from the supplied element.
     *
     * Returns a `TextMetrics` object.
     */
    measureElementTextContent(element: Element, fontProperties?: string | ICssFontProperties) {
        const fontString =
            fontProperties != null ? Utils.getFontString(fontProperties) : Utils.getFontStringFromDom(element);

        // accessing textContent does NOT force a reflow.
        // see: "Differences from innerText" (3rd bullet) at
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
        return Utils.measureText(element.textContent, fontString);
    },

    /**
     * Measures the bounds of supplied text, given the CSS-style font string.
     *
     * Uses a single non-DOM canvas context to measure the text.
     *
     * Returns a `TextMetrics` object.
     */
    measureText(text: string, fontString: string) {
        const context = _getSingletonCanvasContext();
        context.font = fontString;
        return context.measureText(text);
    },

    /**
     * Convert the provided font properties string or object into the equivalent CSS
     * "font"-property shorthand string. Does not force a reflow, because the DOM is
     * never accessed.
     */
    getFontString(fontProperties: string | ICssFontProperties) {
        if (typeof fontProperties === "string") {
            return fontProperties;
        } else {
            return CSS_FONT_PROPERTIES.map(prop => fontProperties[prop]).join(" ");
        }
    },

    /**
     * Lookup the provided element's computed font styles in the DOM, forcing a
     * reflow, and return the equivalent CSS "font"-property shorthand string.
     *
     * For performance info, see:
     * https://gist.github.com/paulirish/5d52fb081b3570c81e3a#getcomputedstyle
     */
    getFontStringFromDom(element: Element) {
        const style = getComputedStyle(element);
        return CSS_FONT_PROPERTIES.map(prop => style.getPropertyValue(prop)).join(" ");
    },

    /**
     * Given a number, returns a value that is clamped within a
     * minimum/maximum bounded range. The minimum and maximum are optional. If
     * either is missing, that extrema limit is not applied.
     *
     * Assumes max >= min.
     */
    clamp(value: number, min?: number, max?: number) {
        if (min != null && value < min) {
            value = min;
        }
        if (max != null && value > max) {
            value = max;
        }
        return value;
    },

    /**
     * When reordering a contiguous block of rows or columns to a new index, we show a preview guide
     * at the absolute index in the original ordering but emit the new index in the reordered list.
     * This function converts an absolute "guide" index to a relative "reordered" index.
     *
     * Example: Say we want to move the first three columns two spots to the right. While we drag, a
     * vertical guide is shown to preview where we'll be dropping the columns. (In the following
     * ASCII art, `*` denotes a selected column, `·` denotes a cell border, and `|` denotes a
     * vertical guide).
     *
     *     Before mousedown:
     *     · 0 · 1 · 2 · 3 · 4 · 5 ·
     *       *   *   *
     *
     *     During mousemove two spots to the right:
     *     · 0 · 1 · 2 · 3 · 4 | 5 ·
     *       *   *   *
     *
     *     After mouseup:
     *     · 3 · 4 · 0 · 1 · 2 · 5 ·
     *               *   *   *
     *
     * Note that moving the three columns beyond index 4 effectively moves them two spots rightward.
     *
     * In this case, the inputs to this function would be:
     *     - oldIndex: 0 (the left-most index of the selected column range in the original ordering)
     *     - newIndex: 5 (the index on whose left boundary the guide appears in the original ordering)
     *     - length: 3 (the number of columns to move)
     *
     * The return value will then be 2, the left-most index of the columns in the new ordering.
     */
    guideIndexToReorderedIndex(oldIndex: number, newIndex: number, length: number) {
        if (newIndex < oldIndex) {
            return newIndex;
        } else if (oldIndex <= newIndex && newIndex < oldIndex + length) {
            return oldIndex;
        } else {
            return Math.max(0, newIndex - length);
        }
    },

    /**
     * When reordering a contiguous block of rows or columns to a new index, we show a preview guide
     * at the absolute index in the original ordering but emit the new index in the reordered list.
     * This function converts a relative "reordered"" index to an absolute "guide" index.
     *
     * For the scenario in the example above, the inputs to this function would be:
     *     - oldIndex: 0 (the left-most index of the selected column range in the original ordering)
     *     - newIndex: 2 (the left-most index of the selected column range in the new ordering)
     *     - length: 3 (the number of columns to move)
     *
     * The return value will then be 5, the index on whose left boundary the guide should appear in
     * the original ordering.
     */
    reorderedIndexToGuideIndex(oldIndex: number, newIndex: number, length: number) {
        return newIndex <= oldIndex ? newIndex : newIndex + length;
    },

    /**
     * Returns a copy of the provided array with the `length` contiguous elements starting at the
     * `from` index reordered to start at the `to` index.
     *
     * For example, given the array [A,B,C,D,E,F], reordering the 3 contiguous elements starting at
     * index 1 (B, C, and D) to start at index 2 would yield [A,E,B,C,D,F].
     */
    reorderArray(array: any[], from: number, to: number, length = 1) {
        if (length === 0 || length === array.length || from === to) {
            // return an unchanged copy
            return array.slice();
        }

        if (length < 0 || length > array.length || from + length > array.length) {
            return undefined;
        }

        const before = array.slice(0, from);
        const within = array.slice(from, from + length);
        const after = array.slice(from + length);

        const result = [];
        let i = 0;
        let b = 0;
        let w = 0;
        let a = 0;

        while (i < to) {
            if (b < before.length) {
                result.push(before[b]);
                b += 1;
            } else {
                result.push(after[a]);
                a += 1;
            }
            i += 1;
        }

        while (w < length) {
            result.push(within[w]);
            w += 1;
            i += 1;
        }

        while (i < array.length) {
            if (b < before.length) {
                result.push(before[b]);
                b += 1;
            } else {
                result.push(after[a]);
                a += 1;
            }
            i += 1;
        }

        return result;
    },

    /**
     * Returns true if the mouse event was triggered by the left mouse button.
     */
    isLeftClick(event: MouseEvent) {
        return event.button === 0;
    },

    // these functions used to live here but now live in core. since these Utils
    // are in the public API, we provide facades here - complete with function
    // descriptions - so as to make the refactor invisible externally.

    /**
     * Returns true if the arrays are equal. Elements will be shallowly compared
     * by default, or they will be compared using the custom `compare` function
     * if one is provided.
     * @deprecated since @blueprintjs/table 1.26.0; import this function from
     * core Utils instead.
     */
    arraysEqual: CoreUtils.arraysEqual,

    /**
     * Deep comparison between objects. If `keys` is provided, just that subset
     * of keys will be compared; otherwise, all keys will be compared.
     * @deprecated since @blueprintjs/table 1.26.0; import this function from
     * core Utils instead.
     */
    deepCompareKeys: CoreUtils.deepCompareKeys,

    /**
     * Returns a descriptive object for each key whose values are deeply unequal
     * between two provided objects. Useful for debugging shouldComponentUpdate.
     * @deprecated since @blueprintjs/table 1.26.0; import this function from
     * core Utils instead.
     */
    getDeepUnequalKeyValues<T extends object>(objA: T, objB: T, keys?: Array<keyof T>) {
        return CoreUtils.getDeepUnequalKeyValues(objA, objB, keys);
    },

    /**
     * Returns a descriptive object for each key whose values are shallowly
     * unequal between two provided objects. Useful for debugging
     * shouldComponentUpdate.
     * @deprecated since @blueprintjs/table 1.26.0; import this function from
     * core Utils instead.
     */
    getShallowUnequalKeyValues<T extends object>(objA: T, objB: T, keys?: IKeyBlacklist<T> | IKeyWhitelist<T>) {
        return CoreUtils.getShallowUnequalKeyValues(objA, objB, keys);
    },

    /**
     * Shallow comparison between objects. If `keys` is provided, just that
     * subset of keys will be compared; otherwise, all keys will be compared.
     * @deprecated since @blueprintjs/table 1.26.0; import this function from
     * core Utils instead.
     */
    shallowCompareKeys<T extends object>(objA: T, objB: T, keys?: IKeyBlacklist<T> | IKeyWhitelist<T>) {
        return CoreUtils.shallowCompareKeys(objA, objB, keys);
    },
};
