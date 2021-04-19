/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { Boundary } from "../../common/boundary";
import * as Classes from "../../common/classes";
import { OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED } from "../../common/errors";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";
import { shallowCompareKeys } from "../../common/utils";
import { ResizeEntry } from "../resize-sensor/resizeObserverTypes";
import { ResizeSensor } from "../resize-sensor/resizeSensor";

/** @internal - do not expose this type */
export enum OverflowDirection {
    NONE,
    GROW,
    SHRINK,
}

// eslint-disable-next-line deprecation/deprecation
export type OverflowListProps<T> = IOverflowListProps<T>;
/** @deprecated use OverflowListProps */
export interface IOverflowListProps<T> extends Props {
    /**
     * Whether to force the overflowRenderer to always be called, even if there are zero items
     * overflowing. This may be useful, for example, if your overflow renderer contains a Popover
     * which you do not want to close as the list is resized.
     *
     * @default false
     */
    alwaysRenderOverflow?: boolean;

    /**
     * Which direction the items should collapse from: start or end of the
     * children. This also determines whether `overflowRenderer` appears before
     * (`START`) or after (`END`) the visible items.
     *
     * @default Boundary.START
     */
    collapseFrom?: Boundary;

    /**
     * All items to display in the list. Items that do not fit in the container
     * will be rendered in the overflow instead.
     */
    items: T[];

    /**
     * The minimum number of visible items that should never collapse into the
     * overflow menu, regardless of DOM dimensions.
     *
     * @default 0
     */
    minVisibleItems?: number;

    /**
     * If `true`, all parent DOM elements of the container will also be
     * observed. If changes to a parent's size is detected, the overflow will be
     * recalculated.
     *
     * Only enable this prop if the overflow should be recalculated when a
     * parent element resizes in a way that does not also cause the
     * `OverflowList` to resize.
     *
     * @default false
     */
    observeParents?: boolean;

    /**
     * Callback invoked when the overflowed items change. This is called once
     * after the DOM has settled, rather that on every intermediate change. It
     * is not invoked if resizing produces an unchanged overflow state.
     */
    onOverflow?: (overflowItems: T[]) => void;

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
     * HTML tag name for the container element.
     *
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * Callback invoked to render each visible item.
     * Remember to set a `key` on the rendered element!
     */
    visibleItemRenderer: (item: T, index: number) => React.ReactChild;
}

export interface IOverflowListState<T> {
    /**
     * Direction of current overflow operation. An overflow can take several frames to settle.
     *
     * @internal don't expose the type
     */
    direction: OverflowDirection;
    /** Length of last overflow to dedupe `onOverflow` calls during smooth resizing. */
    lastOverflowCount: number;
    overflow: T[];
    visible: T[];
}

export class OverflowList<T> extends React.Component<OverflowListProps<T>, IOverflowListState<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.OverflowList`;

    public static defaultProps: Partial<OverflowListProps<any>> = {
        alwaysRenderOverflow: false,
        collapseFrom: Boundary.START,
        minVisibleItems: 0,
    };

    public static ofType<U>() {
        return OverflowList as new (props: OverflowListProps<U>) => OverflowList<U>;
    }

    public state: IOverflowListState<T> = {
        direction: OverflowDirection.NONE,
        lastOverflowCount: 0,
        overflow: [],
        visible: this.props.items,
    };

    /** A cache containing the widths of all elements being observed to detect growing/shrinking */
    private previousWidths = new Map<Element, number>();

    private spacer: Element | null = null;

    public componentDidMount() {
        this.repartition(false);
    }

    public shouldComponentUpdate(_nextProps: OverflowListProps<T>, nextState: IOverflowListState<T>) {
        // We want this component to always re-render, even when props haven't changed, so that
        // changes in the renderers' behavior can be reflected.
        // The following statement prevents re-rendering only in the case where the state changes
        // identity (i.e. setState was called), but the state is still the same when
        // shallow-compared to the previous state.
        return !(this.state !== nextState && shallowCompareKeys(this.state, nextState));
    }

    public componentDidUpdate(prevProps: OverflowListProps<T>, prevState: IOverflowListState<T>) {
        if (prevProps.observeParents !== this.props.observeParents) {
            console.warn(OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED);
        }

        if (
            prevProps.collapseFrom !== this.props.collapseFrom ||
            prevProps.items !== this.props.items ||
            prevProps.minVisibleItems !== this.props.minVisibleItems ||
            prevProps.overflowRenderer !== this.props.overflowRenderer ||
            prevProps.alwaysRenderOverflow !== this.props.alwaysRenderOverflow ||
            prevProps.visibleItemRenderer !== this.props.visibleItemRenderer
        ) {
            // reset visible state if the above props change.
            this.setState({
                direction: OverflowDirection.GROW,
                lastOverflowCount: 0,
                overflow: [],
                visible: this.props.items,
            });
        }

        if (!shallowCompareKeys(prevState, this.state)) {
            this.repartition(false);
        }
        const { direction, overflow, lastOverflowCount } = this.state;
        if (
            // if a resize operation has just completed (transition to NONE)
            direction === OverflowDirection.NONE &&
            direction !== prevState.direction &&
            overflow.length !== lastOverflowCount
        ) {
            this.props.onOverflow?.(overflow);
        }
    }

    public render() {
        const { className, collapseFrom, observeParents, style, tagName = "div", visibleItemRenderer } = this.props;
        const overflow = this.maybeRenderOverflow();
        const list = React.createElement(
            tagName,
            {
                className: classNames(Classes.OVERFLOW_LIST, className),
                style,
            },
            collapseFrom === Boundary.START ? overflow : null,
            this.state.visible.map(visibleItemRenderer),
            collapseFrom === Boundary.END ? overflow : null,
            <div className={Classes.OVERFLOW_LIST_SPACER} ref={ref => (this.spacer = ref)} />,
        );

        return (
            <ResizeSensor onResize={this.resize} observeParents={observeParents}>
                {list}
            </ResizeSensor>
        );
    }

    private maybeRenderOverflow() {
        const { overflow } = this.state;
        if (overflow.length === 0 && !this.props.alwaysRenderOverflow) {
            return null;
        }
        return this.props.overflowRenderer(overflow);
    }

    private resize = (entries: ResizeEntry[]) => {
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
            this.setState(state => ({
                direction: OverflowDirection.GROW,
                // store last overflow if this is the beginning of a resize (for check in componentDidUpdate).
                lastOverflowCount:
                    state.direction === OverflowDirection.NONE ? state.overflow.length : state.lastOverflowCount,
                overflow: [],
                visible: this.props.items,
            }));
        } else if (this.spacer.getBoundingClientRect().width < 0.9) {
            // spacer has flex-shrink and width 1px so if it's much smaller then we know to shrink
            this.setState(state => {
                if (state.visible.length <= this.props.minVisibleItems!) {
                    return null;
                }
                const collapseFromStart = this.props.collapseFrom === Boundary.START;
                const visible = state.visible.slice();
                const next = collapseFromStart ? visible.shift() : visible.pop();
                if (next === undefined) {
                    return null;
                }
                const overflow = collapseFromStart ? [...state.overflow, next] : [next, ...state.overflow];
                return {
                    // set SHRINK mode unless a GROW is already in progress.
                    // GROW shows all items then shrinks until it settles, so we
                    // preserve the fact that the original trigger was a GROW.
                    direction: state.direction === OverflowDirection.NONE ? OverflowDirection.SHRINK : state.direction,
                    overflow,
                    visible,
                };
            });
        } else {
            // repartition complete!
            this.setState({ direction: OverflowDirection.NONE });
        }
    }
}
