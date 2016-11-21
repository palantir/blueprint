/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

/**
 * Re-declare matching types from the classnames library;
 */
export type ClassValue = string | number | ClassDictionary | ClassArray;

/* tslint:disable:interface-name */
export interface ClassDictionary {
    [id: string]: boolean;
}

export interface ClassArray extends Array<ClassValue> { };
/* tslint:enable:interface-name */

/**
 * Since Firefox doesn't provide a computed "font" property, we manually
 * construct it using the ordered properties that can be specifed in CSS.
 */
const CSS_FONT_PROPERTIES = [
    "font-style",
    "font-variant",
    "font-weight",
    "font-size",
    "font-family",
];

export const Utils = {
    /**
     * Returns a clone of the ReactElement with a className that includes the
     * element's original className and any other classes passed in with variadic
     * arguments matching the `classNames` api.
     */
    assignClasses<P extends IProps>(elem: React.ReactElement<P>, ...extendedClasses: ClassValue[]) {
        const classes = classNames(elem.props.className, ...extendedClasses);
        return React.cloneElement(elem, {className : classes} as IProps);
    },

    /**
     * Invokes the callback `n` times, collecting the results in an array, which
     * is the return value. Similar to _.times
     */
    times<T>(n: number, callback: (i: number) => T): T[] {
        return Array.apply(null, Array(n)).map((_none: any, index: number) => callback(index));
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
            let letter = num % 26;
            str = String.fromCharCode(65 + letter) + str;
            num = num - letter;
            if (num <= 0) {
                return str;
            }
            num = (num / 26) - 1;
        }
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
     * Measures the bounds of supplied element's textContent.
     *
     * We use the computed font from the supplied element and a non-DOM canvas
     * context to measure the text.
     *
     * Returns a `TextMetrics` object.
     */
    measureElementTextContent(element: Element) {
        const context = document.createElement("canvas").getContext("2d");
        const style = getComputedStyle(element, null);
        context.font = CSS_FONT_PROPERTIES.map((prop) => style.getPropertyValue(prop)).join(" ");
        return context.measureText(element.textContent);
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
};
