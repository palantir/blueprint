/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";
import * as React from "react";

export interface ITestErrorBoundaryProps {
    expectedErrorString: string;
}

export interface ITestErrorBoundaryState {
    didCatch: boolean;
}

/**
 * Use this component when you want to validate component errors _during the component lifecycle_.
 * Note that this is not useful in validating errors thrown in component constructors.
 */
export class TestErrorBoundary extends React.Component<ITestErrorBoundaryProps, ITestErrorBoundaryState> {
    public state = {
        didCatch: false,
    };

    public componentDidCatch(error: Error, _info: any) {
        this.setState({ didCatch: true }, () => {
            expect(error.message).to.equal(this.props.expectedErrorString);
        });
    }

    public render() {
        if (this.state.didCatch) {
            return null;
        }
        return this.props.children;
    }
}
