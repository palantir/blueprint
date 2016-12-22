/*
 * @license Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */

import * as React from "react";

export abstract class PureComponent<P, S> extends React.PureComponent<P, S> {
    // define this method so that subclasses can call super to invoke the shallow compare behavior as needed
    public shouldComponentUpdate(_nextProps: P, _nextState: S): boolean {
        // filled in by pure render decorator
        return true;
    }
}
