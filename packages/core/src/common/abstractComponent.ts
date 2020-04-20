/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";
import { isNodeEnv } from "./utils";

/**
 * An abstract component that Blueprint components can extend
 * in order to add some common functionality like runtime props validation.
 * @deprecated componentWillReceiveProps is deprecated in React 16.9; use AbstractComponent2 instead
 */
export abstract class AbstractComponent<P, S> extends React.Component<P, S> {
    /** Component displayName should be `public static`. This property exists to prevent incorrect usage. */
    protected displayName: never;

    // Not bothering to remove entries when their timeouts finish because clearing invalid ID is a no-op
    private timeoutIds: number[] = [];

    constructor(props?: P, context?: any) {
        super(props, context);
        if (!isNodeEnv("production")) {
            this.validateProps(this.props);
        }
    }

    public componentWillReceiveProps(nextProps: P & { children?: React.ReactNode }) {
        if (!isNodeEnv("production")) {
            this.validateProps(nextProps);
        }
    }

    public componentWillUnmount() {
        this.clearTimeouts();
    }

    /**
     * Set a timeout and remember its ID.
     * All stored timeouts will be cleared when component unmounts.
     * @returns a "cancel" function that will clear timeout when invoked.
     */
    public setTimeout(callback: () => void, timeout?: number) {
        const handle = window.setTimeout(callback, timeout);
        this.timeoutIds.push(handle);
        return () => window.clearTimeout(handle);
    }

    /**
     * Clear all known timeouts.
     */
    public clearTimeouts = () => {
        if (this.timeoutIds.length > 0) {
            for (const timeoutId of this.timeoutIds) {
                window.clearTimeout(timeoutId);
            }
            this.timeoutIds = [];
        }
    };

    /**
     * Ensures that the props specified for a component are valid.
     * Implementations should check that props are valid and usually throw an Error if they are not.
     * Implementations should not duplicate checks that the type system already guarantees.
     *
     * This method should be used instead of React's
     * [propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) feature.
     * Like propTypes, these runtime checks run only in development mode.
     */
    protected validateProps(_: P & { children?: React.ReactNode }) {
        // implement in subclass
    }
}
