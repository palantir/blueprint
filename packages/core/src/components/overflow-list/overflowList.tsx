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

import { Boundary, Classes, DISPLAYNAME_PREFIX, type Props } from "../../common";
import { OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED } from "../../common/errors";
import { shallowCompareKeys } from "../../common/utils";
import { ResizeSensor } from "../resize-sensor/resizeSensor";

export interface OverflowListProps<T> extends Props {
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
    items: readonly T[];

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

export interface OverflowListState<T> {
    /** Whether repartitioning is still active. An overflow can take several frames to settle. */
    repartitioning: boolean;
    /** Length of last overflow to dedupe `onOverflow` calls during smooth resizing. */
    lastOverflowCount: number;
    overflow: readonly T[];
    visible: readonly T[];
    /** Pointer for the binary search algorithm used to find the finished non-overflowing state */
    chopSize: number;
    lastChopSize: number | null;
}

/**
 * Overflow list component.
 *
 * @see https://blueprintjs.com/docs/#core/components/overflow-list
 */
export class OverflowList<T> extends React.Component<OverflowListProps<T>, OverflowListState<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.OverflowList`;

    public static defaultProps: Partial<OverflowListProps<any>> = {
        alwaysRenderOverflow: false,
        collapseFrom: Boundary.START,
        minVisibleItems: 0,
    };

    public static ofType<U>() {
        return OverflowList as new (props: OverflowListProps<U>) => OverflowList<U>;
    }

    public state: OverflowListState<T> = {
        chopSize: this.defaultChopSize(),
        lastChopSize: null,
        lastOverflowCount: 0,
        overflow: [],
        repartitioning: false,
        visible: this.props.items,
    };

    private spacer: HTMLElement | null = null;

    public componentDidMount() {
        this.repartition();
    }

    public shouldComponentUpdate(nextProps: OverflowListProps<T>, nextState: OverflowListState<T>) {
        // We want this component to always re-render, even when props haven't changed, so that
        // changes in the renderers' behavior can be reflected.
        // The following statement prevents re-rendering only in the case where the state changes
        // identity (i.e. setState was called), but the state is still the same when
        // shallow-compared to the previous state. Original context: https://github.com/palantir/blueprint/pull/3278.
        // We also ensure that we re-render if the props DO change (which isn't necessarily accounted for by other logic).
        return this.props !== nextProps || !(this.state !== nextState && shallowCompareKeys(this.state, nextState));
    }

    public componentDidUpdate(prevProps: OverflowListProps<T>, prevState: OverflowListState<T>) {
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
                chopSize: this.defaultChopSize(),
                lastChopSize: null,
                lastOverflowCount: 0,
                overflow: [],
                repartitioning: true,
                visible: this.props.items,
            });
        }

        const { repartitioning, overflow, lastOverflowCount } = this.state;

        if (
            // if a resize operation has just completed
            repartitioning === false &&
            prevState.repartitioning === true
        ) {
            // only invoke the callback if the UI has actually changed
            if (overflow.length !== lastOverflowCount) {
                this.props.onOverflow?.(overflow.slice());
            }
        } else if (!shallowCompareKeys(prevState, this.state)) {
            this.repartition();
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
        return this.props.overflowRenderer(overflow.slice());
    }

    private resize = () => {
        this.repartition();
    };

    private repartition() {
        if (this.spacer == null) {
            return;
        }

        // if lastChopSize was 1, then our binary search has exhausted.
        const partitionExhausted = this.state.lastChopSize === 1;
        const minVisible = this.props.minVisibleItems ?? 0;

        // spacer has flex-shrink and width 1px so if it's much smaller then we know to shrink
        const shouldShrink = this.spacer.offsetWidth < 0.9 && this.state.visible.length > minVisible;

        // we only check partitionExhausted for shouldGrow to ensure shrinking is the final operation.
        const shouldGrow =
            (this.spacer.offsetWidth >= 1 || this.state.visible.length < minVisible) &&
            this.state.overflow.length > 0 &&
            !partitionExhausted;

        if (shouldShrink || shouldGrow) {
            this.setState(state => {
                let visible;
                let overflow;
                if (this.props.collapseFrom === Boundary.END) {
                    const result = shiftElements(
                        state.visible,
                        state.overflow,
                        this.state.chopSize * (shouldShrink ? 1 : -1),
                    );
                    visible = result[0];
                    overflow = result[1];
                } else {
                    const result = shiftElements(
                        state.overflow,
                        state.visible,
                        this.state.chopSize * (shouldShrink ? -1 : 1),
                    );
                    overflow = result[0];
                    visible = result[1];
                }

                return {
                    chopSize: halve(state.chopSize),
                    lastChopSize: state.chopSize,
                    // if we're starting a new partition cycle, record the last overflow count so we can track whether the UI changes after the new overflow is calculated
                    lastOverflowCount: this.isFirstPartitionCycle(state.chopSize)
                        ? state.overflow.length
                        : state.lastOverflowCount,
                    overflow,
                    repartitioning: true,
                    visible,
                };
            });
        } else {
            // repartition complete!
            this.setState({
                chopSize: this.defaultChopSize(),
                lastChopSize: null,
                repartitioning: false,
            });
        }
    }

    private defaultChopSize(): number {
        return halve(this.props.items.length);
    }

    private isFirstPartitionCycle(currentChopSize: number): boolean {
        return currentChopSize === this.defaultChopSize();
    }
}

function halve(num: number): number {
    return Math.ceil(num / 2);
}

function shiftElements<T>(leftArray: readonly T[], rightArray: readonly T[], num: number): [newFrom: T[], newTo: T[]] {
    // if num is positive then elements are shifted from left-to-right, if negative then right-to-left
    const allElements = leftArray.concat(rightArray);
    const newLeftLength = leftArray.length - num;

    if (newLeftLength <= 0) {
        return [[], allElements];
    } else if (newLeftLength >= allElements.length) {
        return [allElements, []];
    }

    const sliceIndex = allElements.length - newLeftLength;

    return [allElements.slice(0, -sliceIndex), allElements.slice(-sliceIndex)];
}
