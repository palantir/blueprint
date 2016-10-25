/*
 * @license Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */

import * as PureRender from "pure-render-decorator";
import * as React from "react";

@PureRender
export abstract class PureComponent<P, S> extends React.Component<P, S> {
    // define this method so that subclasses can call super to invoke the shallow compare behavior as needed
    public shouldComponentUpdate(_nextProps: P, _nextState: S): boolean {
        // filled in by pure render decorator
        return true;
    }
}
