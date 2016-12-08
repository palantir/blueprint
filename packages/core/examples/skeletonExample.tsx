/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, Skeleton, Slider, Switch } from "@blueprintjs/core";

import BaseExample, { handleBooleanChange } from "./common/baseExample";

export interface ISkeletonExampleState {
    isLoading?: boolean;
    numBones?: number;
    randomWidth?: boolean;
}

export class SkeletonExample extends BaseExample<ISkeletonExampleState> {
    public state: ISkeletonExampleState = {
        isLoading: true,
        numBones: 3,
        randomWidth: false,
    };

    protected className = "docs-skeleton-example";

    private handleIsLoadingChange = handleBooleanChange((isLoading) => this.setState({ isLoading}));
    private handleRandomWidthChange = handleBooleanChange((randomWidth) => this.setState({ randomWidth }));

    public renderExample() {
        const className = classNames("pt-card", "docs-skeleton-example-box", {
            "pt-loading": this.state.isLoading,
        });

        return (
            <div className={className}>
                <Skeleton {...this.state}>
                    <h5><a href="#">Loading Skeleton</a></h5>
                    Use to replace content with a nifty animation! Adjust the number of bones to give users the
                    impression that more or less content is being loaded.
                </Skeleton>
            </div>
        );
    }

    public renderOptions() {
        const { isLoading, numBones, randomWidth } = this.state;
        return [
            [
                <Switch
                    checked={isLoading}
                    key="loading"
                    label="Show loading skeleton"
                    onChange={this.handleIsLoadingChange}
                />,
                <Switch
                    checked={randomWidth}
                    key="random"
                    label="Random bone width"
                    onChange={this.handleRandomWidthChange}
                />,
            ], [
                <label className={Classes.LABEL} key="num-bones">Number of bones</label>,
                <Slider
                    key="bones"
                    max={5}
                    min={1}
                    onChange={this.handleNumBonesChange}
                    showTrackFill={false}
                    value={numBones}
                />,
            ],
        ];
    }

    private handleNumBonesChange = (numBones: number) => this.setState({ numBones });
}
