/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export interface IKeyWhitelist<T> {
    include: Array<keyof T>;
}

export interface IKeyBlacklist<T> {
    exclude: Array<keyof T>;
}

/**
 * Returns true if the arrays are equal. Elements will be shallowly compared by
 * default, or they will be compared using the custom `compare` function if one
 * is provided.
 */
export function arraysEqual(arrA: any[], arrB: any[], compare = (a: any, b: any) => a === b) {
    // treat `null` and `undefined` as the same
    if (arrA == null && arrB == null) {
        return true;
    } else if (arrA == null || arrB == null || arrA.length !== arrB.length) {
        return false;
    } else {
        return arrA.every((a, i) => compare(a, arrB[i]));
    }
}

/**
 * Shallow comparison between objects. If `keys` is provided, just that subset
 * of keys will be compared; otherwise, all keys will be compared.
 */
export function shallowCompareKeys<T extends object>(objA: T, objB: T, keys?: IKeyBlacklist<T> | IKeyWhitelist<T>) {
    // treat `null` and `undefined` as the same
    if (objA == null && objB == null) {
        return true;
    } else if (objA == null || objB == null) {
        return false;
    } else if (Array.isArray(objA) || Array.isArray(objB)) {
        return false;
    } else if (keys != null) {
        return _shallowCompareKeys(objA, objB, keys);
    } else {
        // shallowly compare all keys from both objects
        const keysA = Object.keys(objA) as Array<keyof T>;
        const keysB = Object.keys(objB) as Array<keyof T>;
        return (
            _shallowCompareKeys(objA, objB, { include: keysA }) && _shallowCompareKeys(objA, objB, { include: keysB })
        );
    }
}

/**
 * Deep comparison between objects. If `keys` is provided, just that subset of
 * keys will be compared; otherwise, all keys will be compared.
 */
export function deepCompareKeys(objA: any, objB: any, keys?: string[]): boolean {
    if (objA === objB) {
        return true;
    } else if (objA == null && objB == null) {
        // treat `null` and `undefined` as the same
        return true;
    } else if (objA == null || objB == null) {
        return false;
    } else if (Array.isArray(objA) || Array.isArray(objB)) {
        return arraysEqual(objA, objB, deepCompareKeys);
    } else if (_isSimplePrimitiveType(objA) || _isSimplePrimitiveType(objB)) {
        return objA === objB;
    } else if (keys != null) {
        return _deepCompareKeys(objA, objB, keys);
    } else if (objA.constructor !== objB.constructor) {
        return false;
    } else {
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);
        if (keysA == null || keysB == null) {
            return false;
        }
        if (keysA.length === 0 && keysB.length === 0) {
            return true;
        }
        return arraysEqual(keysA, keysB) && _deepCompareKeys(objA, objB, keysA);
    }
}

/**
 * Returns a descriptive object for each key whose values are shallowly unequal
 * between two provided objects. Useful for debugging shouldComponentUpdate.
 */
export function getShallowUnequalKeyValues<T extends object>(
    objA: T,
    objB: T,
    keys?: IKeyBlacklist<T> | IKeyWhitelist<T>,
) {
    // default param values let null values pass through, so we have to take
    // this more thorough approach
    const definedObjA = objA == null ? {} : objA;
    const definedObjB = objB == null ? {} : objB;

    const filteredKeys = _filterKeys(definedObjA, definedObjB, keys == null ? { exclude: [] } : keys);
    return _getUnequalKeyValues(definedObjA, definedObjB, filteredKeys, (a, b, key) => {
        return shallowCompareKeys(a, b, { include: [key] });
    });
}

/**
 * Returns a descriptive object for each key whose values are deeply unequal
 * between two provided objects. Useful for debugging shouldComponentUpdate.
 */
export function getDeepUnequalKeyValues<T extends object>(
    objA: T = ({} as any) as T,
    objB: T = ({} as any) as T,
    keys?: Array<keyof T>,
) {
    const filteredKeys = keys == null ? _unionKeys(objA, objB) : keys;
    return _getUnequalKeyValues(objA, objB, filteredKeys, (a, b, key) => {
        return deepCompareKeys(a, b, [key]);
    });
}

// Private helpers
// ===============

/**
 * Partial shallow comparison between objects using the given list of keys.
 */
function _shallowCompareKeys<T>(objA: T, objB: T, keys: IKeyBlacklist<T> | IKeyWhitelist<T>) {
    return _filterKeys(objA, objB, keys).every(key => {
        return objA.hasOwnProperty(key) === objB.hasOwnProperty(key) && objA[key] === objB[key];
    });
}

/**
 * Partial deep comparison between objects using the given list of keys.
 */
function _deepCompareKeys(objA: any, objB: any, keys: string[]): boolean {
    return keys.every(key => {
        return objA.hasOwnProperty(key) === objB.hasOwnProperty(key) && deepCompareKeys(objA[key], objB[key]);
    });
}

function _isSimplePrimitiveType(value: any) {
    return typeof value === "number" || typeof value === "string" || typeof value === "boolean";
}

function _filterKeys<T>(objA: T, objB: T, keys: IKeyBlacklist<T> | IKeyWhitelist<T>) {
    if (_isWhitelist(keys)) {
        return keys.include;
    } else {
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        // merge keys from both objects into a big set for quick access
        const keySet = _arrayToObject(keysA.concat(keysB));

        // delete blacklisted keys from the key set
        keys.exclude.forEach(key => delete keySet[key]);

        // return the remaining keys as an array
        return Object.keys(keySet) as Array<keyof T>;
    }
}

function _isWhitelist<T>(keys: any): keys is IKeyWhitelist<T> {
    return keys != null && (keys as IKeyWhitelist<T>).include != null;
}

function _arrayToObject(arr: any[]) {
    return arr.reduce((obj: any, element: any) => {
        obj[element] = true;
        return obj;
    }, {});
}

function _getUnequalKeyValues<T extends object>(
    objA: T,
    objB: T,
    keys: Array<keyof T>,
    compareFn: (objA: any, objB: any, key: keyof T) => boolean,
) {
    const unequalKeys = keys.filter(key => !compareFn(objA, objB, key));
    const unequalKeyValues = unequalKeys.map(key => ({
        key,
        valueA: objA[key],
        valueB: objB[key],
    }));
    return unequalKeyValues;
}

function _unionKeys<T extends object>(objA: T, objB: T) {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    const concatKeys = keysA.concat(keysB);
    const keySet = _arrayToObject(concatKeys);

    return Object.keys(keySet) as Array<keyof T>;
}
