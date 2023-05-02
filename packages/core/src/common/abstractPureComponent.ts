/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class AbstractPureComponent<P, S = {}, SS = {}> extends React.PureComponent<P, S, SS> {
    // unsafe lifecycle method
    public componentWillUpdate!: never;

    public componentWillReceiveProps!: never;

    public componentWillMount!: never;

    // this should be static, not an instance method
    public getDerivedStateFromProps!: never;

    /** Component displayName should be `public static`. This property exists to prevent incorrect usage. */
    protected displayName!: never;

    // Not bothering to remove entries when their timeouts finish because clearing invalid ID is a no-op
    private timeoutIds: number[] = [];

    private requestIds: number[] = [];

    constructor(props: P) {
        super(props);
        if (!isNodeEnv("production")) {
            this.validateProps(this.props);
        }
    }

    public componentDidUpdate(_prevProps: P, _prevState: S, _snapshot?: SS) {
        if (!isNodeEnv("production")) {
            this.validateProps(this.props);
        }
    }

    public componentWillUnmount() {
        this.clearTimeouts();
        this.cancelAnimationFrames();
    }

    /**
     * Request an animation frame and remember its ID.
     * All pending requests will be canceled when component unmounts.
     *
     * @returns a "cancel" function that will cancel the request when invoked.
     */
    public requestAnimationFrame(callback: () => void) {
        const handle = window.requestAnimationFrame(callback);
        this.requestIds.push(handle);
        return () => window.cancelAnimationFrame(handle);
    }

    /**
     * Set a timeout and remember its ID.
     * All pending timeouts will be cleared when component unmounts.
     *
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
     * Clear all known animation frame requests.
     */
    public cancelAnimationFrames = () => {
        if (this.requestIds.length > 0) {
            for (const requestId of this.requestIds) {
                window.cancelAnimationFrame(requestId);
            }
            this.requestIds = [];
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
    protected validateProps(_props: P) {
        // implement in subclass
    }
}
