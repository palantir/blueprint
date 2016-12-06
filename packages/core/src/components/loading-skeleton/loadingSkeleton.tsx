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
     * Specifies the number of animated lines to show.
     * @default 1
     */
    numBones?: number;

    /**
     * If true, render a random width loading skeleton. This can be used to make things like table
     * cells display a more natural-feeling loading state.
     * @default false
     */
    randomWidth?: boolean;
}

export interface ILoadingSkeletonState {
    rightMargins?: number[];
}

export class LoadingSkeleton extends AbstractComponent<ILoadingSkeletonProps, ILoadingSkeletonState> {
    public static defaultProps: ILoadingSkeletonProps = {
        isLoading: true,
        numBones: 1,
        randomWidth: false,
    };

    public state: ILoadingSkeletonState;

    public constructor(props: ILoadingSkeletonProps, context?: any) {
        super(props, context);
        const { numBones, randomWidth } = props;
        const rightMargins = [];
        for (let i = 0; i < numBones; i++) {
            rightMargins.push(this.generateRightMargin(randomWidth));
        }
        this.state = { rightMargins };
    }

    public componentWillReceiveProps(nextProps: ILoadingSkeletonProps) {
        const { numBones, randomWidth } = this.props;
        const { numBones: nextNumBones, randomWidth: nextRandomWidth } = nextProps;
        let rightMargins = this.state.rightMargins.slice();

        if (nextRandomWidth !== randomWidth) {
            rightMargins = [];
            for (let i = 0; i < nextNumBones; i++) {
                rightMargins.push(this.generateRightMargin(nextRandomWidth));
            }
            this.setState({ rightMargins });
        } else if (nextNumBones > numBones) {
            for (let i = numBones; i < nextNumBones; i++) {
                rightMargins.push(this.generateRightMargin(randomWidth));
            }
            this.setState({ rightMargins });
        }
    }

    public render() {
        const className = classNames(Classes.LOADING_SKELETON, Classes.LOADING_SKELETON_CONTENT, {
            "pt-loading-skeleton-bones": this.props.isLoading,
            "pt-loading-skeleton-content": !this.props.isLoading,
        }, this.props.className);

        return (
            <div className={className}>
                {this.props.isLoading ? this.renderLoadingSkeleton() : this.props.children}
            </div>
        );
    }

    private renderLoadingSkeleton() {
        const bones: JSX.Element[] = [];
        for (let i = 0; i < this.props.numBones; i++) {
            const boneClassName = classNames(
                Classes.LOADING_SKELETON_BONE,
                `${Classes.LOADING_SKELETON_BONE}-${this.state.rightMargins[i]}`,
            );
            bones.push(<div className={boneClassName} key={`bone-${i}`} />);
        }

        return bones;
    }

    private generateRightMargin = (randomized: boolean) => {
        return randomized ? Math.floor(Math.random() * 4) * 5 : 0;
    }
}
