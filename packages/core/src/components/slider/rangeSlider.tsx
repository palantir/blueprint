/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { isFunction } from "../../common/utils";
import { CoreSlider, formatPercentage, ICoreSliderProps } from "./coreSlider";
import { Handle } from "./handle";

export type NumberRange = [number, number];

enum RangeIndex {
    START = 0,
    END = 1,
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
        vertical: false,
    };

    public static displayName = "Blueprint2.RangeSlider";
    public className = classNames(Classes.SLIDER, Classes.RANGE_SLIDER);

    private handles: Handle[] = [];

    protected renderFill() {
        const { tickSizeRatio } = this.state;
        const [startValue, endValue] = this.props.value;
        if (startValue === endValue) {
            return undefined;
        }
        let offsetRatio = (startValue - this.props.min) * tickSizeRatio;
        let sizeRatio = (endValue - startValue) * tickSizeRatio;

        if (sizeRatio < 0) {
            offsetRatio += sizeRatio;
            sizeRatio = Math.abs(sizeRatio);
        }

        // expand by 1px in each direction so it sits under the handle border
        const offsetCalc = `calc(${formatPercentage(offsetRatio)} - 1px)`;
        const sizeCalc = `calc(${formatPercentage(sizeRatio)} + 2px)`;

        const style: React.CSSProperties = this.props.vertical
            ? { bottom: offsetCalc, height: sizeCalc }
            : { left: offsetCalc, width: sizeCalc };

        return <div className={`${Classes.SLIDER}-progress`} style={style} />;
    }

    protected renderHandles() {
        const { disabled, max, min, onRelease, stepSize, value, vertical } = this.props;
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
                tickSizeRatio={this.state.tickSizeRatio}
                value={val}
                vertical={vertical}
            />
        ));
    }

    protected handleTrackClick(event: React.MouseEvent<HTMLElement>) {
        this.handles
            .reduce((min, handle) => {
                // find closest handle to the mouse position
                const offset = handle.mouseEventClientOffset(event);
                const value = handle.clientToValue(offset);
                return this.nearestHandleForValue(value, min, handle);
            })
            .beginHandleMovement(event);
    }

    protected handleTrackTouch(event: React.TouchEvent<HTMLElement>) {
        this.handles
            .reduce((min, handle) => {
                // find closest handle to the touch position
                const value = handle.clientToValue(handle.touchEventClientOffset(event));
                return this.nearestHandleForValue(value, min, handle);
            })
            .beginHandleTouchMovement(event);
    }

    protected nearestHandleForValue(value: number, firstHandle: Handle, secondHandle: Handle) {
        const firstHandleValue = firstHandle.props.value;
        const firstDistance = Math.abs(value - firstHandleValue);
        const secondDistance = Math.abs(value - secondHandle.props.value);
        if (firstDistance < secondDistance) {
            return firstHandle;
        } else if (secondDistance < firstDistance) {
            return secondHandle;
        } else {
            // if the values are equal, return the handle that is *able* to move
            // in the necessary direction.
            return value < firstHandleValue ? firstHandle : secondHandle;
        }
    }

    protected validateProps(props: IRangeSliderProps) {
        const { value } = props;
        if (value == null || value[RangeIndex.START] == null || value[RangeIndex.END] == null) {
            throw new Error(Errors.RANGESLIDER_NULL_VALUE);
        }
    }

    private addHandleRef = (ref: Handle) => {
        if (ref != null) {
            this.handles.push(ref);
        }
    };

    private getHandlerForIndex = (index: RangeIndex, callback: (value: NumberRange) => any) => (newValue: number) => {
        if (isFunction(callback)) {
            const [startValue, endValue] = this.props.value;
            if (index === RangeIndex.START) {
                callback([Math.min(newValue, endValue), endValue]);
            } else {
                callback([startValue, Math.max(newValue, startValue)]);
            }
        }
    };

    private handleChange = (newValue: NumberRange) => {
        const [startValue, endValue] = this.props.value;
        const [newStartValue, newEndValue] = newValue;
        if ((startValue !== newStartValue || endValue !== newEndValue) && isFunction(this.props.onChange)) {
            this.props.onChange(newValue);
        }
    };
}
