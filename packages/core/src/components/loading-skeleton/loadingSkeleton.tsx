/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { AbstractComponent, Classes, IProps } from "../../common";

export interface ILoadingSkeletonProps extends IProps {
    /**
     * If true, show an animated loading skeleton. Otherwise render this component's child.
     */
    isLoading: boolean;

    /**
     * If true, render a random width loading skeleton. This can be used for make things like table
     * cells display a more natural-feeling loading state.
     * @default false
     */
    randomWidth?: boolean;
}

export interface ILoadingSkeletonState {
    rightMargin: number;
}

export class LoadingSkeleton extends AbstractComponent<ILoadingSkeletonProps, ILoadingSkeletonState> {
    public static defaultProps: ILoadingSkeletonProps = {
        isLoading: true,
        randomWidth: false,
    };

    public state: ILoadingSkeletonState;

    public constructor(props: ILoadingSkeletonProps, context?: any) {
        super(props, context);
        this.state = {
            rightMargin: this.props.randomWidth ? Math.floor(Math.random() * 4) * 5 : 0,
        };
    }

    public render() {
        if (this.props.isLoading) {
            return this.renderLoadingSkeleton();
        }

        return React.Children.only(this.props.children);
    }

    private renderLoadingSkeleton() {
        const skeletonClassName = classNames(
            Classes.LOADING_SKELETON,
            this.props.className,
            `${Classes.LOADING_SKELETON}-${this.state.rightMargin}`,
        );

        return (
            <div className={skeletonClassName} />
        );
    }
}
