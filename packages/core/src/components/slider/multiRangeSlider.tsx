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
import { ISliderHandleProps, SliderHandle } from "./sliderHandle";

export interface IMultiRangeSliderProps extends ICoreSliderProps {
    children?: React.ReactNode;
    defaultTrackIntent?: Intent;
    onChange?(values: number[]): void;
    onRelease?(values: number[]): void;
}

export class MultiRangeSlider extends CoreSlider<IMultiRangeSliderProps> {
    public static defaultProps: IMultiRangeSliderProps = {
        disabled: false,
        labelStepSize: 1,
        max: 10,
        min: 0,
        showTrackFill: true,
        stepSize: 1,
        vertical: false,
    };

    public static displayName = "Blueprint2.MultiRangeSlider";
    public className = classNames(Classes.SLIDER, Classes.MULTI_RANGE_SLIDER);

    private handles: Handle[] = [];

    public componentWillReceiveProps(nextProps: IMultiRangeSliderProps & { children: React.ReactNode }) {
        super.componentWillReceiveProps(nextProps);
        if (getHandles(nextProps).length !== this.getHandles().length) {
            this.handles = [];
        }
    }

    protected validateProps(props: IMultiRangeSliderProps) {
        let anyNonHandleChildren = false;
        React.Children.forEach(props.children, child => {
            if (child != null && !Utils.isElementOfType(child, SliderHandle)) {
                anyNonHandleChildren = true;
            }
        });
        if (anyNonHandleChildren) {
            throw new Error(Errors.MULTIRANGESLIDER_INVALID_CHILD);
        }
    }

    protected renderFill() {
        const minHandle: ISliderHandleProps = { value: this.props.min };
        const maxHandle: ISliderHandleProps = { value: this.props.max };
        const expandedHandles = [minHandle, ...this.getSortedHandles(), maxHandle];

        const tracks: Array<JSX.Element | null> = [];

        for (let index = 0; index < expandedHandles.length - 1; index++) {
            const left = expandedHandles[index];
            const right = expandedHandles[index + 1];
            const fillIntentPriorities = [
                left.trackIntentAbove,
                right.trackIntentBelow,
                this.props.defaultTrackIntent,
                Intent.NONE,
            ];
            const fillIntent = fillIntentPriorities.filter(intent => intent != null)[0];
            tracks.push(this.renderTrackFill(index, left, right, fillIntent));
        }

        return <div className={Classes.SLIDER_TRACK}>{tracks}</div>;
    }

    protected renderHandles() {
        const { disabled, max, min, stepSize, vertical, onRelease } = this.props;
        return this.getSortedHandles().map(({ value, type }, index) => (
            <Handle
                className={classNames({
                    [Classes.LOWER]: type === "lower",
                    [Classes.UPPER]: type === "upper",
                })}
                disabled={disabled}
                key={`${index}-${this.getHandles().length}`}
                label={this.formatLabel(value)}
                max={max}
                min={min}
                onChange={this.getHandlerForIndex(index, this.handleChange)}
                onRelease={this.getHandlerForIndex(index, onRelease)}
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

    private renderTrackFill(index: number, left: ISliderHandleProps, right: ISliderHandleProps, intent: Intent) {
        const { tickSizeRatio } = this.state;
        const lowerValue = left.value;
        const upperValue = right.value;

        if (intent === Intent.NONE || lowerValue === upperValue) {
            return undefined;
        }

        let lowerOffsetRatio = this.getOffsetRatio(lowerValue, tickSizeRatio);
        let upperOffsetRatio = this.getOffsetRatio(upperValue, tickSizeRatio);

        if (lowerOffsetRatio > upperOffsetRatio) {
            const temp = upperOffsetRatio;
            upperOffsetRatio = lowerOffsetRatio;
            lowerOffsetRatio = temp;
        }

        const lowerOffset = formatPercentage(lowerOffsetRatio);
        const upperOffset = formatPercentage(1 - upperOffsetRatio);

        const style: React.CSSProperties = this.props.vertical
            ? { bottom: lowerOffset, top: upperOffset, left: 0 }
            : { left: lowerOffset, right: upperOffset, top: 0 };

        const classes = classNames(Classes.SLIDER_PROGRESS, intentClass(intent), {
            [Classes.LOWER]: left.type === "lower",
            [Classes.UPPER]: right.type === "upper",
        });

        return <div key={`track-${index}`} className={classes} style={style} />;
    }

    private getOffsetRatio(value: number, tickSizeRatio: number) {
        return (value - this.props.min) * tickSizeRatio;
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
            if (Utils.isFunction(callback)) {
                const values = this.getHandles().map(handle => handle.value);
                const start = values.slice(0, index);
                const end = values.slice(index + 1);
                const newValues = [...start, newValue, ...end];
                newValues.sort();
                callback(newValues);
            }
        };
    };

    private handleChange = (values: number[]) => {
        const oldValues = this.getSortedHandles().map(handle => handle.value);
        const newValues = values.slice().sort(compare);
        if (!areValuesEqual(newValues, oldValues) && Utils.isFunction(this.props.onChange)) {
            this.props.onChange(newValues);
        }
    };

    private getSortedHandles(): ISliderHandleProps[] {
        const handles = this.getHandles();
        return handles.sort((left, right) => compare(left.value, right.value));
    }

    private getHandles(): ISliderHandleProps[] {
        return getHandles(this.props);
    }
}

function getHandles({ children }: IMultiRangeSliderProps): ISliderHandleProps[] {
    return React.Children.map(
        children,
        child => (Utils.isElementOfType(child, SliderHandle) ? child.props : null),
    ).filter(child => child !== null);
}

function compare(left: number, right: number) {
    if (left < right) {
        return -1;
    } else if (left > right) {
        return 1;
    }
    return 0;
}

function areValuesEqual(left: number[], right: number[]) {
    if (left.length !== right.length) {
        return false;
    }
    for (let index = 0; index < left.length; index++) {
        if (left[index] !== right[index]) {
            return false;
        }
    }
    return true;
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
