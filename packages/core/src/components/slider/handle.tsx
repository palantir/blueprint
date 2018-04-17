/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IProps } from "../../common/props";
import { clamp, safeInvoke } from "../../common/utils";
import { formatPercentage } from "./coreSlider";

/**
 * N.B. some properties need to be optional for spread in slider.tsx to work
 */
export interface IHandleProps extends IProps {
    disabled?: boolean;
    label: React.ReactChild;
    max?: number;
    min?: number;
    onChange?: (newValue: number) => void;
    onRelease?: (newValue: number) => void;
    stepSize?: number;
    tickSize?: number;
    tickSizeRatio?: number;
    value?: number;
    vertical?: boolean;
}

export interface IHandleState {
    /** whether slider handle is currently being dragged */
    isMoving?: boolean;
}

// props that require number values, for validation
const NUMBER_PROPS = ["max", "min", "stepSize", "tickSize", "value"];

export class Handle extends AbstractPureComponent<IHandleProps, IHandleState> {
    public static displayName = "Blueprint2.SliderHandle";

    public state = {
        isMoving: false,
    };

    private handleElement: HTMLElement;
    private refHandlers = {
        handle: (el: HTMLSpanElement) => (this.handleElement = el),
    };

    public render() {
        const { className, disabled, label, min, tickSizeRatio, value, vertical } = this.props;
        const { isMoving } = this.state;

        // The handle midpoint of RangeSlider is actually shifted by a margin to
        // be on the edge of the visible handle element. Because the midpoint
        // calculation does not take this margin into account, we instead
        // measure the long side (which is equal to the short side plus the
        // margin).
        const { handleMidpoint } = this.getHandleMidpointAndOffset(this.handleElement, true);
        const offsetRatio = (value - min) * tickSizeRatio;
        const offsetCalc = `calc(${formatPercentage(offsetRatio)} - ${handleMidpoint}px)`;
        const style: React.CSSProperties = vertical ? { bottom: offsetCalc } : { left: offsetCalc };

        return (
            <span
                className={classNames(Classes.SLIDER_HANDLE, { [Classes.ACTIVE]: isMoving }, className)}
                onKeyDown={disabled ? null : this.handleKeyDown}
                onKeyUp={disabled ? null : this.handleKeyUp}
                onMouseDown={disabled ? null : this.beginHandleMovement}
                onTouchStart={disabled ? null : this.beginHandleTouchMovement}
                ref={this.refHandlers.handle}
                style={style}
                tabIndex={0}
            >
                {label == null ? null : <span className={Classes.SLIDER_LABEL}>{label}</span>}
            </span>
        );
    }

    public componentWillUnmount() {
        this.removeDocumentEventListeners();
    }

    /** Convert client pixel to value between min and max. */
    public clientToValue(clientPixel: number) {
        const { stepSize, tickSize, value, vertical } = this.props;
        if (this.handleElement == null) {
            return value;
        }

        // #1769: this logic doesn't work perfectly when the tick size is
        // smaller than the handle size; it may be off by a tick or two.
        const clientPixelNormalized = vertical ? window.innerHeight - clientPixel : clientPixel;
        const handleCenterPixel = this.getHandleElementCenterPixel(this.handleElement);
        const pixelDelta = clientPixelNormalized - handleCenterPixel;

        // convert pixels to range value in increments of `stepSize`
        const valueDelta = Math.round(pixelDelta / (tickSize * stepSize)) * stepSize;

        return value + valueDelta;
    }

    public mouseEventClientOffset(event: MouseEvent | React.MouseEvent<HTMLElement>) {
        return this.props.vertical ? event.clientY : event.clientX;
    }

    public touchEventClientOffset(event: TouchEvent | React.TouchEvent<HTMLElement>) {
        const touch = event.changedTouches[0];
        return this.props.vertical ? touch.clientY : touch.clientX;
    }

    public beginHandleMovement = (event: MouseEvent | React.MouseEvent<HTMLElement>) => {
        document.addEventListener("mousemove", this.handleHandleMovement);
        document.addEventListener("mouseup", this.endHandleMovement);
        this.setState({ isMoving: true });
        this.changeValue(this.clientToValue(this.mouseEventClientOffset(event)));
    };

    public beginHandleTouchMovement = (event: TouchEvent | React.TouchEvent<HTMLElement>) => {
        document.addEventListener("touchmove", this.handleHandleTouchMovement);
        document.addEventListener("touchend", this.endHandleTouchMovement);
        document.addEventListener("touchcancel", this.endHandleTouchMovement);
        this.setState({ isMoving: true });
        this.changeValue(this.clientToValue(this.touchEventClientOffset(event)));
    };

    protected validateProps(props: IHandleProps) {
        for (const prop of NUMBER_PROPS) {
            if (typeof (props as any)[prop] !== "number") {
                throw new Error(`[Blueprint] <Handle> requires number value for ${prop} prop`);
            }
        }
    }

    private endHandleMovement = (event: MouseEvent) => {
        this.handleMoveEndedAt(this.mouseEventClientOffset(event));
    };

    private endHandleTouchMovement = (event: TouchEvent) => {
        this.handleMoveEndedAt(this.touchEventClientOffset(event));
    };

    private handleMoveEndedAt = (clientPixel: number) => {
        this.removeDocumentEventListeners();
        this.setState({ isMoving: false });
        // not using changeValue because we want to invoke the handler regardless of current prop value
        const { onRelease } = this.props;
        const finalValue = this.clamp(this.clientToValue(clientPixel));
        safeInvoke(onRelease, finalValue);
    };

    private handleHandleMovement = (event: MouseEvent) => {
        this.handleMovedTo(this.mouseEventClientOffset(event));
    };

    private handleHandleTouchMovement = (event: TouchEvent) => {
        this.handleMovedTo(this.touchEventClientOffset(event));
    };

    private handleMovedTo = (clientPixel: number) => {
        if (this.state.isMoving && !this.props.disabled) {
            this.changeValue(this.clientToValue(clientPixel));
        }
    };

    private handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        const { stepSize, value } = this.props;
        const { which } = event;
        if (which === Keys.ARROW_DOWN || which === Keys.ARROW_LEFT) {
            this.changeValue(value - stepSize);
            // this key event has been handled! prevent browser scroll on up/down
            event.preventDefault();
        } else if (which === Keys.ARROW_UP || which === Keys.ARROW_RIGHT) {
            this.changeValue(value + stepSize);
            event.preventDefault();
        }
    };

    private handleKeyUp = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if ([Keys.ARROW_UP, Keys.ARROW_DOWN, Keys.ARROW_LEFT, Keys.ARROW_RIGHT].indexOf(event.which) >= 0) {
            safeInvoke(this.props.onRelease, this.props.value);
        }
    };

    /** Clamp value and invoke callback if it differs from current value */
    private changeValue(newValue: number, callback = this.props.onChange) {
        newValue = this.clamp(newValue);
        if (!isNaN(newValue) && this.props.value !== newValue) {
            safeInvoke(callback, newValue);
        }
    }

    /** Clamp value between min and max props */
    private clamp(value: number) {
        return clamp(value, this.props.min, this.props.max);
    }

    private getHandleElementCenterPixel(handleElement: HTMLElement) {
        const { handleMidpoint, handleOffset } = this.getHandleMidpointAndOffset(handleElement);
        return handleOffset + handleMidpoint;
    }

    private getHandleMidpointAndOffset(handleElement: HTMLElement, useOppositeDimension = false) {
        if (handleElement == null) {
            return { handleMidpoint: 0, handleOffset: 0 };
        }

        const { vertical } = this.props;

        // getBoundingClientRect().height includes border size; clientHeight does not.
        const handleRect = handleElement.getBoundingClientRect();

        const sizeKey = vertical
            ? useOppositeDimension ? "width" : "height"
            : useOppositeDimension ? "height" : "width";

        // "bottom" value seems to be consistently incorrect, so explicitly
        // calculate it using the window offset instead.
        const handleOffset = vertical ? window.innerHeight - (handleRect.top + handleRect[sizeKey]) : handleRect.left;

        return { handleMidpoint: handleRect[sizeKey] / 2, handleOffset };
    }

    private removeDocumentEventListeners() {
        document.removeEventListener("mousemove", this.handleHandleMovement);
        document.removeEventListener("mouseup", this.endHandleMovement);
        document.removeEventListener("touchmove", this.handleHandleTouchMovement);
        document.removeEventListener("touchend", this.endHandleTouchMovement);
        document.removeEventListener("touchcancel", this.endHandleTouchMovement);
    }
}
