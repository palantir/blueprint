/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { defaults } from "lodash";

/**
 * Simple typed storage API for a JSON serializable object in web local storage
 * or session storage.
 */
export class LocalStore<T extends object> {
    private storage: Storage;

    constructor(private key: string, session = false) {
        this.storage = session ? sessionStorage : localStorage;
    }

    public getWithDefaults(defaultValue?: T): T | {} {
        return defaults(this.get(), defaultValue);
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
