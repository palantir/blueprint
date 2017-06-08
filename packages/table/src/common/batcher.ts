/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { requestIdleCallback } from "./requestIdleCallback";

export interface IIndex<T> {
    [key: string]: T;
}

export type SimpleStringifyable = string | number | null;

export type Callback = () => void;

/**
 * This class helps batch updates to large lists.
 *
 * For example, if your react component has many children, updating them all at
 * once may cause jank when reconciling the DOM. This class helps you update
 * only a few per frame.
 *
 * A typical usage would be:
 *
 * ```typescript
 *
 * public renderChildren = (allChildrenKeys: string[]) => {
 *
 *     batcher.startNewBatch();
 *
 *     allChildrenKeys.forEach((prop1, index) => {
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
    public static DEFAULT_REMOVE_LIMIT = 20;

    private currentObjects: IIndex<T> = {};
    private batchArgs: IIndex<any[]> = {};
    private done = true;
    private callback: Callback;

    /**
     * Resets the "batch" and "current" sets. This essentially clears the cache
     * and prevents accidental re-use of "current" objects.
     */
    public reset() {
        this.batchArgs = {};
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
        this.batchArgs[args.join("|")] = args;
    }

    /**
     * Compares the set of "batch" arguments to the "current" set. Creates any
     * new objects using the callback as a factory. Removes old objects.
     *
     * Arguments are in the "current" set but were not part of the last "batch"
     * set are considered candidates for removal. Similarly, Arguments that are
     * part of the "batch" set but not the "current" set are candidates for
     * addition.
     *
     * The number of objects added and removed maybe limited with the `..Limit`
     * parameters.
     *
     * Finally, the batcher determines if the batching is complete if the
     * "current" arguments match the "batch" arguments.
     */
    public removeOldAddNew(
            callback: (...args: any[]) => T,
            addNewLimit = Batcher.DEFAULT_ADD_LIMIT,
            removeOldLimit = Batcher.DEFAULT_REMOVE_LIMIT,
    ) {
        // remove old
        const toRemove = this.setDifference(this.currentObjects, this.batchArgs, removeOldLimit);
        toRemove.forEach((key) => delete this.currentObjects[key]);

        // add new using callback as object factory
        const toAdd = this.setDifference(this.batchArgs, this.currentObjects, addNewLimit);
        toAdd.forEach((key) => this.currentObjects[key] = callback.apply(undefined, this.batchArgs[key]));

        // set `done` to true of sets match exactly after add/remove
        this.done = this.setHasSameKeys(this.batchArgs, this.currentObjects);
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
        return Object.keys(this.currentObjects).map((key) => this.currentObjects[key]);
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
        if (callback) {
            delete this.callback;
            callback();
        }
    }

    /**
     * Subtracts the keys of A from B -- that is: (keys(A) - keys(B)).
     *
     * Returns an array of at most `limit` keys.
     */
    private setDifference(a: IIndex<any>, b: IIndex<any>, limit: number) {
        const diff = [];
        const aKeys = Object.keys(a);
        for (let i = 0; i < aKeys.length && limit > 0; i++) {
            const key = aKeys[i];
            if (a[key] && !b[key]) {
                diff.push(key);
                limit--;
            }
        }
        return diff;
    }

    /**
     * Returns true of objects `a` and `b` have exactly the same keys.
     */
    private setHasSameKeys(a: IIndex<any>, b: IIndex<any>) {
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
