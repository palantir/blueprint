/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

/**
 * An abstract component that Blueprint components can extend
 * in order to add some common functionality like runtime props validation.
 */
export abstract class AbstractComponent<P, S> extends React.Component<P, S> {
    public displayName: string;

    // Not bothering to remove entries when their timeouts finish because clearing finished timeout is no-op
    private timeoutHandles: number[] = [];

    constructor(props?: P, context?: any) {
        super(props, context);
        this.validateProps(this.props);
    }

    public componentWillReceiveProps(nextProps: P & {children?: React.ReactNode}) {
        this.validateProps(nextProps);
    }

    public componentWillUnmount() {
        this.clearTimeouts();
    }

    /**
     * Set a timeout and remember its ID.
     * All stored timeouts will be cleared when component unmounts.
     * @returns a "cancel" function that will clear timeout when invoked.
     */
    public setTimeout(handler: Function, timeout?: number) {
        const handle = setTimeout(handler, timeout);
        this.timeoutHandles.push(handle);
        return () => clearTimeout(handle);
    }

    /**
     * Clear all known timeouts.
     */
    public clearTimeouts = () => {
        if (this.timeoutHandles.length > 0) {
            // always produces empty list cuz clearTimeout returns void
            this.timeoutHandles = this.timeoutHandles.filter(clearTimeout);
        }
    }

   /**
    * Ensures that the props specified for a component are valid.
    * Implementations should check that props are valid and usually throw an Error if they are not.
    * Implementations should not duplicate checks that the type system already guarantees.
    *
    * This method should be used instead of React's
    * [propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) feature.
    * In contrast to propTypes, these runtime checks are _always_ run, not just in development mode.
    */
    protected validateProps(_: P & {children?: React.ReactNode}) {
        // implement in subclass
    };
}
