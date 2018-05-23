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

export interface IMultiRangeSliderProps extends ICoreSliderProps {
    children?: Array<React.ReactElement<ISliderHandleProps>>;
    defaultTrackIntent?: Intent;
    onChange?(values: number[]): void;
    onRelease?(values: number[]): void;
}

export class MultiRangeSlider extends CoreSlider<IMultiRangeSliderProps> {
    public static defaultProps: IMultiRangeSliderProps = {
        ...CoreSlider.defaultProps,
        defaultTrackIntent: Intent.NONE,
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
        return this.getSortedHandles().map(({ value, type }, index) => (
            <Handle
                className={classNames({
                    [Classes.START]: type === SliderHandleType.START,
                    [Classes.END]: type === SliderHandleType.END,
                })}
                disabled={disabled}
                key={`${index}-${this.getHandles().length}`}
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
            if (Utils.isFunction(callback)) {
                callback(this.getNewHandleValues(newValue, index));
            }
        };
    };

    private getNewHandleValues(newValue: number, index: number) {
        const handles = this.getSortedHandles();
        const values = handles.map(handle => handle.value);
        const start = values.slice(0, index);
        const end = values.slice(index + 1);
        const newValues = [...start, newValue, ...end];
        newValues.sort((left, right) => left - right);

        const newIndex = newValues.indexOf(newValue);
        if (handles[newIndex].interactionKind === SliderHandleInteractionKind.PUSH) {
            newValues[index] = newValues[newIndex];
        } else {
            newValues[newIndex] = newValues[index];
        }

        return newValues;
    }

    private handleChange = (newValues: number[]) => {
        const oldValues = this.getSortedHandles().map(handle => handle.value);
        if (!Utils.arraysEqual(newValues, oldValues) && Utils.isFunction(this.props.onChange)) {
            this.props.onChange(newValues);
        }
    };

    private handleRelease = (newValues: number[]) => {
        if (Utils.isFunction(this.props.onRelease)) {
            this.props.onRelease(newValues);
        }
    };

    private getSortedHandles(): ISliderHandleProps[] {
        const handles = this.getHandles();
        return handles.sort((left, right) => left.value - right.value);
    }

    private getHandles(): ISliderHandleProps[] {
        return getHandles(this.props);
    }
}

function getHandles({ children }: IMultiRangeSliderProps): ISliderHandleProps[] {
    const maybeHandles = React.Children.map(
        children,
        child => (Utils.isElementOfType(child, SliderHandle) ? child.props : null),
    );
    const handles = maybeHandles != null ? maybeHandles : [];
    return handles.filter(handle => handle !== null);
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
