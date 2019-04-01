/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
