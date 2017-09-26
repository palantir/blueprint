/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// tslint:disable:max-classes-per-file

class GridEntry<T> {
    public static key(i: number, j: number) {
        return `${i}_${j}`;
    }

    public constructor(public i: number, public j: number, public value: T) {}

    // there are two things here called `key` but they're certainly not overloaded (one being static)
    // TSLint bug report: https://github.com/palantir/tslint/issues/2139
    // tslint:disable-next-line:adjacent-overload-signatures
    public get key() {
        return GridEntry.key(this.i, this.j);
    }
}

export class SparseGridMutableStore<T> {
    private list: Array<GridEntry<T>>;
    private map: { [key: string]: GridEntry<T> };

    public constructor() {
        this.clear();
    }

    public clear() {
        this.list = [] as Array<GridEntry<T>>;
        this.map = {} as { [key: string]: GridEntry<T> };
    }

    public set(i: number, j: number, value: T) {
        const entry = this.map[GridEntry.key(i, j)];
        if (entry != null) {
            entry.value = value;
        } else {
            this.add(i, j, value);
        }
    }

    public unset(i: number, j: number) {
        const entryKey = GridEntry.key(i, j);
        const entry = this.map[entryKey];
        if (entry != null) {
            const index = this.list.indexOf(entry);
            if (index > -1) {
                this.list.splice(index, 1);
            }
            delete this.map[entryKey];
        }
    }

    public get(i: number, j: number): T {
        const entry = this.map[GridEntry.key(i, j)];
        return entry == null ? undefined : entry.value;
    }

    public insertI(i: number, count: number) {
        this.shift(i, count, "i");
    }

    public insertJ(j: number, count: number) {
        this.shift(j, count, "j");
    }

    public deleteI(i: number, count: number) {
        this.remove(i, count, "i");
        this.shift(i + count, -count, "i");
    }

    public deleteJ(j: number, count: number) {
        this.remove(j, count, "j");
        this.shift(j + count, -count, "j");
    }

    private add(i: number, j: number, value: T) {
        const entry = new GridEntry<T>(i, j, value);
        this.list.push(entry);
        this.map[entry.key] = entry;
    }

    private shift(index: number, count: number, coordinate: "i" | "j") {
        const shifted = [] as Array<GridEntry<T>>;

        // remove entries that need to be shifted from map
        for (const entry of this.list) {
            if ((entry as any)[coordinate] >= index) {
                shifted.push(entry);
                delete this.map[entry.key];
            }
        }

        // adjust coordinates
        for (const entry of shifted) {
            (entry as any)[coordinate] += count;
        }

        // add shifted entries back to map
        for (const entry of shifted) {
            this.map[entry.key] = entry;
        }
    }

    private remove(index: number, count: number, coordinate: "i" | "j") {
        const maintained = [] as Array<GridEntry<T>>;

        // remove entries map as we go, rebuild list from maintained entries
        for (const entry of this.list) {
            if ((entry as any)[coordinate] >= index && (entry as any)[coordinate] < index + count) {
                delete this.map[entry.key];
            } else {
                maintained.push(entry);
            }
        }

        this.list = maintained;
    }
}
