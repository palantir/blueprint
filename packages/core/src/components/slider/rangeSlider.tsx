/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { isFunction } from "../../common/utils";
import { CoreSlider, ICoreSliderProps } from "./coreSlider";
import { Handle } from "./handle";

export type NumberRange = [number, number];

enum RangeEnd {
    LEFT = 0,
    RIGHT = 1,
}

export interface IRangeSliderProps extends ICoreSliderProps {
    /**
     * Range value of slider. Handles will be rendered at each position in the range.
     * @default [0, 10]
     */
    value?: NumberRange;

    /** Callback invoked when the range value changes. */
    onChange?(value: NumberRange): void;

    /** Callback invoked when a handle is released. */
    onRelease?(value: NumberRange): void;
}

export class RangeSlider extends CoreSlider<IRangeSliderProps> {
    public static defaultProps: IRangeSliderProps = {
        disabled: false,
        labelStepSize: 1,
        max: 10,
        min: 0,
        showTrackFill: true,
        stepSize: 1,
        value: [0, 10],
    };

    public displayName = "Blueprint.RangeSlider";
    public className = classNames(Classes.SLIDER, Classes.RANGE_SLIDER);

    private handles: Handle[] = [];

    protected renderFill() {
        const [leftValue, rightValue] = this.props.value;
        if (leftValue === rightValue) { return undefined; }
        // expand by 1px in each direction so it sits under the handle border
        let left = Math.round((leftValue - this.props.min) * this.state.tickSize) - 1;
        let width = Math.round((rightValue - leftValue) * this.state.tickSize) + 2;
        if (width < 0) {
            left += width;
            width = Math.abs(width);
        }
        return <div className={`${Classes.SLIDER}-progress`} style={{ left, width }} />;
    }

    protected renderHandles() {
        const { disabled, max, min, onRelease, stepSize, value } = this.props;
        return value.map((val, index) => (
            <Handle
                disabled={disabled}
                key={index}
                label={this.formatLabel(val)}
                max={max}
                min={min}
                onChange={this.getHandlerForIndex(index, this.handleChange)}
                onRelease={this.getHandlerForIndex(index, onRelease)}
                ref={this.addHandleRef}
                stepSize={stepSize}
                tickSize={this.state.tickSize}
                value={val}
            />
        ));
    }

    protected handleTrackClick(event: MouseEvent | React.MouseEvent<HTMLElement>) {
        this.handles.reduce((min, handle) => {
            // find closest handle to the mouse position
            const value = handle.clientToValue(event.clientX);
            if (Math.abs(value - handle.props.value) < Math.abs(value - min.props.value)) {
                return handle;
            }
            return min;
        }).beginHandleMovement(event);
    }

    protected validateProps(props: IRangeSliderProps) {
        const { value } = props;
        if (value == null || value[RangeEnd.LEFT] == null || value[RangeEnd.RIGHT] == null) {
            throw new Error(Errors.RANGESLIDER_NULL_VALUE);
        }
    }

    private addHandleRef = (ref: Handle) => {
        if (ref != null) {
            this.handles.push(ref);
        }
    }

    private getHandlerForIndex = (index: RangeEnd, callback: (value: NumberRange) => any) => (newValue: number) => {
        if (isFunction(callback)) {
            const [leftValue, rightValue] = this.props.value;
            if (index === RangeEnd.LEFT) {
                callback([Math.min(newValue, rightValue), rightValue]);
            } else {
                callback([leftValue, Math.max(newValue, leftValue)]);
            }
        }
    }

    private handleChange = (newValue: NumberRange) => {
        const [leftValue, rightValue] = this.props.value;
        const [newLeftValue, newRightValue] = newValue;
        if ((leftValue !== newLeftValue || rightValue !== newRightValue) && isFunction(this.props.onChange)) {
            this.props.onChange(newValue);
        }
    }
}

export const RangeSliderFactory = React.createFactory(RangeSlider);
