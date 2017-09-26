/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Utils } from "@blueprintjs/core";
import { requestIdleCallback } from "./requestIdleCallback";

export type SimpleStringifyable = string | number | null | undefined;

export type Callback = () => void;

/**
 * This class helps batch updates to large lists.
 *
 * For example, if your React component has many children, updating them all at
 * once may cause jank when reconciling the DOM. This class helps you update
 * only a few children per frame.
 *
 * A typical usage would be:
 *
 * ```tsx
 * public renderChildren = (allChildrenKeys: string[]) => {
 *
 *     batcher.startNewBatch();
 *
 *     allChildrenKeys.forEach((prop1: string, index: number) => {
 *         batcher.addArgsToBatch(prop1, "prop2", index);
 *     });
 *
 *     batcher.removeOldAddNew((prop1: string, prop2: string, other: number) => {
 *         return <Child prop1={prop1} prop2={prop2} other={other} />;
 *     });
 *
 *     if (!batcher.isDone()) {
 *         batcher.idleCallback(this.forceUpdate());
 *     }
 *
 *     const currentChildren = batcher.getList();
 *     return currentChildren;
 * }
 *
 * ```
 */
export class Batcher<T> {
    public static DEFAULT_ADD_LIMIT = 20;
    public static DEFAULT_UPDATE_LIMIT = 20;
    public static DEFAULT_REMOVE_LIMIT = 20;
    public static ARG_DELIMITER = "|";

    private currentObjects: Record<string, T> = {};
    private oldObjects: Record<string, T> = {};
    private batchArgs: Record<string, any[]> = {};
    private done = true;
    private callback: Callback;

    /**
     * Resets the "batch" and "current" sets. This essentially clears the cache
     * and prevents accidental re-use of "current" objects.
     */
    public reset() {
        this.batchArgs = {};
        this.oldObjects = this.currentObjects;
        this.currentObjects = {};
    }

    /**
     * Starts a new "batch" argument set
     */
    public startNewBatch() {
        this.batchArgs = {};
    }

    /**
     * Stores the variadic arguments to be later batched together.
     *
     * The arguments must be simple stringifyable objects.
     */
    public addArgsToBatch(...args: SimpleStringifyable[]) {
        this.batchArgs[args.join(Batcher.ARG_DELIMITER)] = args;
    }

    /**
     * Compares the set of "batch" arguments to the "current" set. Creates any
     * new objects using the callback as a factory. Removes old objects.
     *
     * Arguments that are in the "current" set but were not part of the last
     * "batch" set are considered candidates for removal. Similarly, Arguments
     * that are part of the "batch" set but not the "current" set are candidates
     * for addition.
     *
     * The number of objects added and removed may be limited with the
     * `...Limit` parameters.
     *
     * Finally, the batcher determines if the batching is complete if the
     * "current" arguments match the "batch" arguments.
     */
    public removeOldAddNew(
        callback: (...args: any[]) => T,
        addNewLimit = Batcher.DEFAULT_ADD_LIMIT,
        removeOldLimit = Batcher.DEFAULT_REMOVE_LIMIT,
        updateLimit = Batcher.DEFAULT_UPDATE_LIMIT,
    ) {
        // remove old
        const keysToRemove = this.setKeysDifference(this.currentObjects, this.batchArgs, removeOldLimit);
        keysToRemove.forEach(key => delete this.currentObjects[key]);

        // remove ALL old objects not in batch
        const keysToRemoveOld = this.setKeysDifference(this.oldObjects, this.batchArgs, -1);
        keysToRemoveOld.forEach(key => delete this.oldObjects[key]);

        // copy ALL old objects into current objects if not defined
        const keysToShallowCopy = Object.keys(this.oldObjects);
        keysToShallowCopy.forEach(key => {
            if (this.currentObjects[key] == null) {
                this.currentObjects[key] = this.oldObjects[key];
            }
        });

        // update old objects with factory
        const keysToUpdate = this.setKeysIntersection(this.oldObjects, this.currentObjects, updateLimit);
        keysToUpdate.forEach(key => {
            delete this.oldObjects[key];
            this.currentObjects[key] = callback.apply(undefined, this.batchArgs[key]);
        });

        // add new objects with factory
        const keysToAdd = this.setKeysDifference(this.batchArgs, this.currentObjects, addNewLimit);
        keysToAdd.forEach(key => (this.currentObjects[key] = callback.apply(undefined, this.batchArgs[key])));

        // set `done` to true of sets match exactly after add/remove and there
        // are no "old objects" remaining
        this.done =
            this.setHasSameKeys(this.batchArgs, this.currentObjects) && Object.keys(this.oldObjects).length === 0;
    }

    /**
     * Returns true of the "current" set matches the "batch" set.
     */
    public isDone() {
        return this.done;
    }

    /**
     * Returns all the objects in the "current" set.
     */
    public getList(): T[] {
        return Object.keys(this.currentObjects).map(this.mapCurrentObjectKey);
    }

    /**
     * Registers a callback to be invoked on the next idle frame. If a callback
     * has already been registered, we do not register a new one.
     */
    public idleCallback(callback: Callback) {
        if (!this.callback) {
            this.callback = callback;
            requestIdleCallback(this.handleIdleCallback);
        }
    }

    public cancelOutstandingCallback() {
        delete this.callback;
    }

    private handleIdleCallback = () => {
        const callback = this.callback;
        delete this.callback;
        Utils.safeInvoke(callback);
    };

    private mapCurrentObjectKey = (key: string) => {
        return this.currentObjects[key];
    };

    private setKeysDifference(a: Record<string, any>, b: Record<string, any>, limit: number) {
        return this.setKeysOperation(a, b, "difference", limit);
    }

    private setKeysIntersection(a: Record<string, any>, b: Record<string, any>, limit: number) {
        return this.setKeysOperation(a, b, "intersect", limit);
    }

    /**
     * Compares the keys of A from B -- and performs an "intersection" or
     * "difference" operation on the keys.
     *
     * Note that the order of operands A and B matters for the "difference"
     * operation.
     *
     * Returns an array of at most `limit` keys.
     */
    private setKeysOperation(
        a: Record<string, any>,
        b: Record<string, any>,
        operation: "intersect" | "difference",
        limit: number,
    ) {
        const result = [];
        const aKeys = Object.keys(a);
        for (let i = 0; i < aKeys.length && (limit < 0 || result.length < limit); i++) {
            const key = aKeys[i];
            if ((operation === "difference" && a[key] && !b[key]) || (operation === "intersect" && a[key] && b[key])) {
                result.push(key);
            }
        }
        return result;
    }

    /**
     * Returns true of objects `a` and `b` have exactly the same keys.
     */
    private setHasSameKeys(a: Record<string, any>, b: Record<string, any>) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        for (const aKey of aKeys) {
            if (b[aKey] === undefined) {
                return false;
            }
        }
        return true;
    }
}
