/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";

import { Boundary } from "../../common/boundary";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { throttle } from "../../common/utils";

export interface IOverflowListProps<T> extends IProps {
    /**
     * Which direction the items should collapse from: start or end of the children.
     * @default Boundary.START
     */
    collapseFrom?: Boundary;

    /**
     * All items to display in the list. Items that don’t fit in the container will be rendered in the overflow instead.
     */
    items: T[];

    /**
     * If `true`, all parent elements of the container will also be observed. If changes to a parent’s size is detected, the overflow will
     * be recalculated.
     * Only enable this prop if the overflow should be recalculated when a parent element resizes in a way that does not also cause the
     * `OverflowContainer` to resize.
     */
    observeParents?: boolean;

    /**
     * Callback invoked to render the overflow if necessary.
     * @param overflowItems The items that didn’t fit in the container.
     */
    overflowRenderer: (overflowItems: T[]) => React.ReactNode;

    /**
     * Callback invoked to render each visible item.
     */
    visibleItemRenderer: (item: T, index: number) => React.ReactChild;
}

export interface IOverflowListState<T> {
    overflow: T[];
    visible: T[];
}

export class OverflowList<T> extends React.Component<IOverflowListProps<T>, IOverflowListState<T>> {
    public static displayName = "Blueprint2.OverflowList";

    public static defaultProps: Partial<IOverflowListProps<never>> = {
        collapseFrom: Boundary.START,
    };

    public static ofType<T>() {
        return OverflowList as new (props: IOverflowListProps<T>) => OverflowList<T>;
    }

    public state: IOverflowListState<T> = {
        overflow: [],
        visible: this.props.items,
    };

    private element: Element | null = null;
    private observer = new ResizeObserver(
        throttle((entries: ResizeObserverEntry[]) => {
            this.resize(entries.map(entry => ({ element: entry.target, width: entry.contentRect.width })));
        }),
    );
    private previousWidths = new Map<Element, number>();
    private spacer: Element | null = null;

    public componentDidMount() {
        if (this.element != null) {
            this.observer.observe(this.element);
            this.previousWidths.set(this.element, this.element.getBoundingClientRect().width);
            if (this.props.observeParents) {
                for (let element: Element | null = this.element; element != null; element = element.parentElement) {
                    this.observer.observe(element);
                    this.previousWidths.set(element, element.getBoundingClientRect().width);
                }
            }
        }
    }

    public componentWillReceiveProps(nextProps: IOverflowListProps<T>) {
        this.setState({
            overflow: [],
            visible: nextProps.items,
        });
    }

    public componentDidUpdate() {
        const entries = Array.from(this.previousWidths.keys()).map(element => ({
            element,
            width: element.getBoundingClientRect().width,
        }));
        this.resize(entries);
    }

    public componentWillUnmount() {
        Array.from(this.previousWidths.keys()).forEach(element => this.observer.unobserve(element));
    }

    public render() {
        const { className, collapseFrom } = this.props;
        const overflow = this.maybeRenderOverflow();
        return (
            <div className={classNames(Classes.OVERFLOW_LIST, className)} ref={ref => (this.element = ref)}>
                {collapseFrom === Boundary.START ? overflow : null}
                {this.renderItems()}
                {collapseFrom === Boundary.END ? overflow : null}
                <div className={Classes.OVERFLOW_LIST_SPACER} ref={ref => (this.spacer = ref)} />
            </div>
        );
    }

    private renderItems() {
        return this.state.visible.map(this.props.visibleItemRenderer);
    }

    private maybeRenderOverflow() {
        const { overflow } = this.state;
        if (overflow.length === 0) {
            return null;
        }
        return this.props.overflowRenderer(overflow);
    }

    private resize(entries: Array<{ element: Element; width: number }>) {
        // if any parent is growing, assume we have more room than before
        const growing = entries.some(entry => {
            const previousWidth = this.previousWidths.get(entry.element) || 0;
            return entry.width > previousWidth;
        });
        this.repartition(growing);
        entries.forEach(entry => this.previousWidths.set(entry.element, entry.width));
    }

    private repartition(growing: boolean) {
        if (this.spacer == null) {
            return;
        }
        if (growing) {
            this.setState({
                overflow: [],
                visible: this.props.items,
            });
        } else if (this.spacer.getBoundingClientRect().width < 1) {
            this.setState(state => {
                const collapseFromStart = this.props.collapseFrom === Boundary.START;
                const visible = state.visible.slice();
                const next = collapseFromStart ? visible.shift() : visible.pop();
                if (next === undefined) {
                    return null;
                }
                const overflow = collapseFromStart ? [next, ...state.overflow] : [...state.overflow, next];
                return {
                    overflow,
                    visible,
                };
            });
        }
    }
}
