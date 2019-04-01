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

import * as React from "react";

import { Classes } from "@blueprintjs/core";

export interface ILoadableContentProps {
    /**
     * If true, render a skeleton. Otherwise render the single, non-string child passed to this
     * component.
     */
    loading: boolean;

    /**
     * If true, show a skeleton of random width (25-75% cell width) when rendering the loading state.
     * @default false
     */
    variableLength?: boolean;
}

// This class expects a single, non-string child.
export class LoadableContent extends React.PureComponent<ILoadableContentProps, {}> {
    private style: React.CSSProperties;

    public constructor(props: ILoadableContentProps) {
        super(props);
        this.style = this.calculateStyle(props.variableLength);
    }

    public componentWillReceiveProps(nextProps: ILoadableContentProps) {
        if ((!this.props.loading && nextProps.loading) || this.props.variableLength !== nextProps.variableLength) {
            this.style = this.calculateStyle(nextProps.variableLength);
        }
    }

    public render() {
        if (this.props.loading) {
            return <div className={Classes.SKELETON} style={this.style} />;
        }

        return React.Children.only(this.props.children);
    }

    private calculateStyle(variableLength: boolean) {
        const skeletonLength = variableLength ? 75 - Math.floor(Math.random() * 11) * 5 : 100;
        return { width: `${skeletonLength}%` };
    }
}
