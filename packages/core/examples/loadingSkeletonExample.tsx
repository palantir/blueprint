/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { LoadingSkeleton, Switch } from "@blueprintjs/core";
import { Cell } from "@blueprintjs/table";

import BaseExample, { handleBooleanChange } from "./common/baseExample";

export interface ILoadingSkeletonState {
    isLoading?: boolean;
}

export class LoadingSkeletonExample extends BaseExample<ILoadingSkeletonState> {
    public state: ILoadingSkeletonState = {
        isLoading: true,
    };

    protected className = "docs-loading-skeleton-example";

    private handleIsLoadingChange = handleBooleanChange((isLoading) => this.setState({ isLoading}));

    public renderExample() {
        return (
            <div className={classNames("docs-loading-skeleton-example-box", { "pt-loading": this.state.isLoading })}>
                <LoadingSkeleton isLoading={this.state.isLoading} randomWidth={this.state.isLoading}>
                    <div>Here is some text hidden by loading</div>
                </LoadingSkeleton>
            </div>
        );
    }

    public renderOptions() {
        const { isLoading } = this.state;
        return [
            [
                <Switch
                    checked={isLoading}
                    key="loading"
                    label="Show Loading Skeleton"
                    onChange={this.handleIsLoadingChange}
                />,

            ],
        ];
    }
}
