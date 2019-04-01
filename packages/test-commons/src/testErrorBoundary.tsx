/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
