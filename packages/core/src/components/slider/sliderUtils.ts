/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * 
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/** Helper function for formatting ratios as CSS percentage values. */
export function formatPercentage(ratio: number) {
    return `${(ratio * 100).toFixed(2)}%`;
}

/**
 * Mutates the values array by filling all the values between start and end index (inclusive) with the fill value.
 */
export function fillValues<T>(values: T[], startIndex: number, endIndex: number, fillValue: T) {
    const inc = startIndex < endIndex ? 1 : -1;
    for (let index = startIndex; index !== endIndex + inc; index += inc) {
        values[index] = fillValue;
    }
}

/**
 * Returns the minimum element of an array as determined by comparing the results of calling the arg function on each
 * element of the array. The function will only be called once per element.
 */
export function argMin<T>(values: T[], argFn: (value: T) => any): T | undefined {
    if (values.length === 0) {
        return undefined;
    }

    let minValue = values[0];
    let minArg = argFn(minValue);

    for (let index = 1; index < values.length; index++) {
        const value = values[index];
        const arg = argFn(value);
        if (arg < minArg) {
            minValue = value;
            minArg = arg;
        }
    }

    return minValue;
}
