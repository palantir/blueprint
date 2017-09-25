/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 *
 * Demonstrates sample usage of the table component.
 */

import { defaults } from "lodash";

export class LocalStore<T> {
    private storage: Storage;

    constructor(private key: string, session = false){
        this.storage = session ? sessionStorage : localStorage;
    }

    public getWithDefaults(defs?: T): T | {} {
        return defaults(this.get(), defs);
    }

    public get(): T | {} {
        const domString = this.storage.getItem(this.key);
        if (domString == null || domString === "") {
            return {};
        }
        try {
            return JSON.parse(domString);
        } catch (e) {
            return {};
        }
    }

    public set(state: T) {
        this.storage.setItem(this.key, JSON.stringify(state));
    }

    public clear() {
        this.storage.removeItem(this.key);
    }
}
