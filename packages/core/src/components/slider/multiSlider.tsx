/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Classes, Intent } from "../../common";
import { intentClass } from "../../common/classes";
import * as Errors from "../../common/errors";
import * as Utils from "../../common/utils";
import { CoreSlider, formatPercentage, ICoreSliderProps } from "./coreSlider";
import { Handle } from "./handle";
import { ISliderHandleProps, SliderHandle, SliderHandleInteractionKind, SliderHandleType } from "./sliderHandle";

export interface IMultiSliderProps extends ICoreSliderProps {
    children?: Array<React.ReactElement<ISliderHandleProps>>;
    defaultTrackIntent?: Intent;
    onChange?(values: number[]): void;
    onRelease?(values: number[]): void;
}

export class MultiSlider extends CoreSlider<IMultiSliderProps> {
    public static defaultProps: IMultiSliderProps = {
        ...CoreSlider.defaultProps,
        defaultTrackIntent: Intent.NONE,
    };

    public static displayName = "Blueprint2.MultiSlider";
    public className = classNames(Classes.SLIDER, Classes.MULTI_SLIDER);

    private handles: Handle[] = [];
    private sortedHandleProps: ISliderHandleProps[];

    public componentWillMount() {
        this.sortedHandleProps = getSortedHandleProps(this.props);
    }

    public componentWillReceiveProps(nextProps: IMultiSliderProps & { children: React.ReactNode }) {
        super.componentWillReceiveProps(nextProps);
        const newSortedHandleProps = getSortedHandleProps(nextProps);
        if (newSortedHandleProps.length !== this.sortedHandleProps.length) {
            this.handles = [];
        }
        this.sortedHandleProps = newSortedHandleProps;
    }

    protected validateProps(props: IMultiSliderProps) {
        let anyNonHandleChildren = false;
        React.Children.forEach(props.children, child => {
            if (child != null && !Utils.isElementOfType(child, SliderHandle)) {
                anyNonHandleChildren = true;
            }
        });
        if (anyNonHandleChildren) {
            throw new Error(Errors.MULTISLIDER_INVALID_CHILD);
        }
    }

    protected renderFill() {
        const minHandle: ISliderHandleProps = { value: this.props.min };
        const maxHandle: ISliderHandleProps = { value: this.props.max };
        const expandedHandles = [minHandle, ...this.sortedHandleProps, maxHandle];

        const tracks: Array<JSX.Element | null> = [];

        for (let index = 0; index < expandedHandles.length - 1; index++) {
            const left = expandedHandles[index];
            const right = expandedHandles[index + 1];
            const fillIntentPriorities = [
                left.trackIntentAfter,
                right.trackIntentBefore,
                this.props.defaultTrackIntent,
            ];
            const fillIntent = fillIntentPriorities.filter(intent => intent != null)[0];
            tracks.push(this.renderTrackFill(index, left, right, fillIntent));
        }

        return <div className={Classes.SLIDER_TRACK}>{tracks}</div>;
    }

    protected renderHandles() {
        const { disabled, max, min, stepSize, vertical } = this.props;
        return this.sortedHandleProps.map(({ value, type }, index) => (
            <Handle
                className={classNames({
                    [Classes.START]: type === SliderHandleType.START,
                    [Classes.END]: type === SliderHandleType.END,
                })}
                disabled={disabled}
                key={`${index}-${this.sortedHandleProps.length}`}
                label={this.formatLabel(value)}
                max={max}
                min={min}
                onChange={this.getHandlerForIndex(index, this.handleChange)}
                onRelease={this.getHandlerForIndex(index, this.handleRelease)}
                ref={this.addHandleRef}
                stepSize={stepSize}
                tickSize={this.state.tickSize}
                tickSizeRatio={this.state.tickSizeRatio}
                value={value}
                vertical={vertical}
            />
        ));
    }

    protected handleTrackClick(event: React.MouseEvent<HTMLElement>) {
        const foundHandle = this.nearestHandleForValue(this.handles, handle => handle.mouseEventClientOffset(event));
        if (foundHandle) {
            foundHandle.beginHandleMovement(event);
        }
    }

    protected handleTrackTouch(event: React.TouchEvent<HTMLElement>) {
        const foundHandle = this.nearestHandleForValue(this.handles, handle => handle.touchEventClientOffset(event));
        if (foundHandle) {
            foundHandle.beginHandleTouchMovement(event);
        }
    }

    private renderTrackFill(index: number, start: ISliderHandleProps, end: ISliderHandleProps, intent: Intent) {
        const { tickSizeRatio } = this.state;
        const startValue = start.value;
        const endValue = end.value;

        if (startValue === endValue) {
            return undefined;
        }

        let startOffsetRatio = this.getOffsetRatio(startValue, tickSizeRatio);
        let endOffsetRatio = this.getOffsetRatio(endValue, tickSizeRatio);

        if (startOffsetRatio > endOffsetRatio) {
            const temp = endOffsetRatio;
            endOffsetRatio = startOffsetRatio;
            startOffsetRatio = temp;
        }

        const startOffset = formatPercentage(startOffsetRatio);
        const endOffset = formatPercentage(1 - endOffsetRatio);

        const style: React.CSSProperties = this.props.vertical
            ? { bottom: startOffset, top: endOffset, left: 0 }
            : { left: startOffset, right: endOffset, top: 0 };

        const classes = classNames(Classes.SLIDER_PROGRESS, intentClass(intent), {
            [Classes.START]: start.type === SliderHandleType.START,
            [Classes.END]: end.type === SliderHandleType.END,
            [`${Classes.SLIDER_PROGRESS}-empty`]: intent === Intent.NONE,
        });

        return <div key={`track-${index}`} className={classes} style={style} />;
    }

    private getOffsetRatio(value: number, tickSizeRatio: number) {
        return Utils.clamp((value - this.props.min) * tickSizeRatio, 0, 1);
    }

    private nearestHandleForValue(handles: Handle[], getOffset: (handle: Handle) => number): Handle | undefined {
        return argMin(handles, handle => {
            const offset = getOffset(handle);
            const offsetValue = handle.clientToValue(offset);
            const handleValue = handle.props.value!;
            return Math.abs(offsetValue - handleValue);
        });
    }

    private addHandleRef = (ref: Handle) => {
        if (ref != null) {
            this.handles.push(ref);
        }
    };

    private getHandlerForIndex = (index: number, callback?: (values: number[]) => void) => {
        return (newValue: number) => {
            Utils.safeInvoke(callback, this.getNewHandleValues(newValue, index));
        };
    };

    private getNewHandleValues(newValue: number, oldIndex: number) {
        const oldValues = this.sortedHandleProps.map(handle => handle.value);
        const start = oldValues.slice(0, oldIndex);
        const end = oldValues.slice(oldIndex + 1);
        const newValues = [...start, newValue, ...end];
        newValues.sort((left, right) => left - right);

        const newIndex = newValues.indexOf(newValue);
        const lockIndex = this.findFirstLockedHandleIndex(oldIndex, newIndex);
        if (lockIndex === undefined) {
            fillValues(newValues, oldIndex, newIndex, newValue);
        } else {
            // If pushing past a locked handle, discard the new value and only make the updates to clamp values against the lock.
            const lockValue = oldValues[lockIndex];
            fillValues(oldValues, oldIndex, lockIndex, lockValue);
            return oldValues;
        }

        return newValues;
    }

    private findFirstLockedHandleIndex(startIndex: number, endIndex: number): number | undefined {
        const inc = startIndex < endIndex ? 1 : -1;
        for (let index = startIndex + inc; index !== endIndex + inc; index += inc) {
            if (this.sortedHandleProps[index].interactionKind !== SliderHandleInteractionKind.PUSH) {
                return index;
            }
        }
        return undefined;
    }

    private handleChange = (newValues: number[]) => {
        const oldValues = this.sortedHandleProps.map(handle => handle.value);
        if (!Utils.arraysEqual(newValues, oldValues)) {
            Utils.safeInvoke(this.props.onChange, newValues);
        }
    };

    private handleRelease = (newValues: number[]) => {
        Utils.safeInvoke(this.props.onRelease, newValues);
    };
}

function getSortedHandleProps({ children }: IMultiSliderProps): ISliderHandleProps[] {
    const maybeHandles = React.Children.map(
        children,
        child => (Utils.isElementOfType(child, SliderHandle) ? child.props : null),
    );
    let handles = maybeHandles != null ? maybeHandles : [];
    handles = handles.filter(handle => handle !== null);
    handles.sort((left, right) => left.value - right.value);
    return handles;
}

function fillValues(values: number[], startIndex: number, endIndex: number, fillValue: number) {
    const inc = startIndex < endIndex ? 1 : -1;
    for (let index = startIndex; index !== endIndex + inc; index += inc) {
        values[index] = fillValue;
    }
}

function argMin<T>(values: T[], argFn: (value: T) => any): T | undefined {
    if (values.length === 0) {
        return undefined;
    }

    let minValue = values[0];
    let minArg = argFn(minValue);

    for (let index = 1; index < values.length; index++) {
        const value = values[index];
        const arg = argFn(value);
        if (arg < minArg) {
            minValue = value;
            minArg = arg;
        }
    }

    return minValue;
}
