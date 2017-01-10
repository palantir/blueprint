/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Classes } from "@blueprintjs/core";

export interface ILoadingProps {
    /**
     * If true, show a fixed height loading skeleton instead of the cell content.
     * @default false
     */
    loading?: boolean;
}

export interface ILoadableContentProps extends ILoadingProps {
    /**
     * If true, show a skeleton of random width (25-75% cell width) when rendering the loading state.
     * @default false
     */
    variableLength?: boolean;
}

// This class expects a single, non-string child.
export class LoadableContent extends React.Component<ILoadableContentProps, {}> {
    private style: React.CSSProperties;

    public constructor(props: ILoadableContentProps) {
        super(props);
        const skeletonLength = props.variableLength ? 75 - Math.floor(Math.random() * 11) * 5 : 100;
        this.style = { width: `${skeletonLength}%` };
    }

    public render() {
        if (this.props.loading) {
            return <div className={Classes.SKELETON} style={this.style} />;
        }

        return React.Children.only(this.props.children);
    }
}
