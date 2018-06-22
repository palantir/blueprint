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
import { OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED } from "../../common/errors";
import { IProps } from "../../common/props";
import { throttle } from "../../common/utils";

export interface IOverflowListProps<T> extends IProps {
    /**
     * Which direction the items should collapse from: start or end of the
     * children. This also determines whether `overflowRenderer` appears before
     * (`START`) or after (`END`) the visible items.
     * @default Boundary.START
     */
    collapseFrom?: Boundary;

    /**
     * All items to display in the list. Items that do not fit in the container
     * will be rendered in the overflow instead.
     */
    items: T[];

    /**
     * If `true`, all parent DOM elements of the container will also be
     * observed. If changes to a parent's size is detected, the overflow will be
     * recalculated.
     *
     * Only enable this prop if the overflow should be recalculated when a
     * parent element resizes in a way that does not also cause the
     * `OverflowList` to resize.
     * @default false
     */
    observeParents?: boolean;

    /**
     * Callback invoked to render the overflowed items. Unlike
     * `visibleItemRenderer`, this prop is invoked once with all items that do
     * not fit in the container.
     *
     * Typical use cases for this prop will put overflowed items in a dropdown
     * menu or display a "+X items" label.
     */
    overflowRenderer: (overflowItems: T[]) => React.ReactNode;

    /** CSS properties to apply to the root element. */
    style?: React.CSSProperties;

    /**
     * Callback invoked to render each visible item.
     * Remember to set a `key` on the rendered element!
     */
    visibleItemRenderer: (item: T, index: number) => React.ReactChild;
}

export interface IOverflowListState<T> {
    overflow: T[];
    visible: T[];
}

export class OverflowList<T> extends React.PureComponent<IOverflowListProps<T>, IOverflowListState<T>> {
    public static displayName = "Blueprint2.OverflowList";

    public static defaultProps: Partial<IOverflowListProps<any>> = {
        collapseFrom: Boundary.START,
    };

    public static ofType<T>() {
        return OverflowList as new (props: IOverflowListProps<T>) => OverflowList<T>;
    }

    private element: Element | null = null;
    private spacer: Element | null = null;
    private observer: ResizeObserver;

    /** A cache containing the widths of all elements being observed to detect growing/shrinking */
    private previousWidths = new Map<Element, number>();

    public constructor(props: IOverflowListProps<T>, context?: any) {
        super(props, context);

        // constructor is necessary to ensure observer is defined
        this.observer = new ResizeObserver(throttle(this.resize));
        this.state = {
            overflow: [],
            visible: props.items,
        };
    }

    public componentDidMount() {
        if (this.element != null) {
            // observer callback is invoked immediately when observing new elements
            this.observer.observe(this.element);
            if (this.props.observeParents) {
                for (let element: Element | null = this.element; element != null; element = element.parentElement) {
                    this.observer.observe(element);
                }
            }
            this.repartition(false);
        }
    }

    public componentWillReceiveProps(nextProps: IOverflowListProps<T>) {
        const { collapseFrom, items, observeParents, overflowRenderer, visibleItemRenderer } = this.props;
        if (observeParents !== nextProps.observeParents) {
            console.warn(OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED);
        }
        if (
            collapseFrom !== nextProps.collapseFrom ||
            items !== nextProps.items ||
            overflowRenderer !== nextProps.overflowRenderer ||
            visibleItemRenderer !== nextProps.visibleItemRenderer
        ) {
            // reset visible state if the above props change.
            this.setState({
                overflow: [],
                visible: nextProps.items,
            });
        }
    }

    public componentDidUpdate() {
        this.repartition(false);
    }

    public componentWillUnmount() {
        this.observer.disconnect();
    }

    public render() {
        const { className, collapseFrom, style, visibleItemRenderer } = this.props;
        const overflow = this.maybeRenderOverflow();
        return (
            <div
                className={classNames(Classes.OVERFLOW_LIST, className)}
                ref={ref => (this.element = ref)}
                style={style}
            >
                {collapseFrom === Boundary.START ? overflow : null}
                {this.state.visible.map(visibleItemRenderer)}
                {collapseFrom === Boundary.END ? overflow : null}
                <div className={Classes.OVERFLOW_LIST_SPACER} ref={ref => (this.spacer = ref)} />
            </div>
        );
    }

    private maybeRenderOverflow() {
        const { overflow } = this.state;
        if (overflow.length === 0) {
            return null;
        }
        return this.props.overflowRenderer(overflow);
    }

    private resize = (entries: ResizeObserverEntry[]) => {
        // if any parent is growing, assume we have more room than before
        const growing = entries.some(entry => {
            const previousWidth = this.previousWidths.get(entry.target) || 0;
            return entry.contentRect.width > previousWidth;
        });
        this.repartition(growing);
        entries.forEach(entry => this.previousWidths.set(entry.target, entry.contentRect.width));
    };

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
            // spacer has flex-shrink and width 1px so if it's any smaller then we know to shrink
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
