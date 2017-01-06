/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Classes } from "@blueprintjs/core";

export interface ILoadable {
    /**
     * Render the loading state.
     * @default false
     */
    loading?: boolean;
}

export interface ILoadableContentProps extends ILoadable {
    /**
     * Show a variable length skeleton when rendering the loading state.
     * @default false
     */
    variableLength?: boolean;
}

export class LoadableContent extends React.Component<ILoadableContentProps, {}> {
    private skeletonLength: number;

    public constructor(props: ILoadableContentProps) {
        super(props);
        this.skeletonLength = props.variableLength ? 100 - Math.floor(Math.random() * 4) * 5 : 100;
    }

    public render() {
        if (this.props.loading) {
            return <div className={`${Classes.SKELETON} ${Classes.SKELETON}-${this.skeletonLength}`} />;
        }

        return React.Children.only(this.props.children);
    }
}
