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
import { clamp, safeInvoke } from "../../common/utils";
import { IHandleProps } from "./handleProps";
import { formatPercentage } from "./sliderUtils";

/**
 * Props for the internal <Handle> component needs some additional info from the parent Slider.
 * N.B. some properties need to be optional for spread in slider.tsx to work
 */
export interface IInternalHandleProps extends IHandleProps {
    disabled?: boolean;
    label: React.ReactChild;
    max?: number;
    min?: number;
    stepSize?: number;
    tickSize?: number;
    tickSizeRatio?: number;
    vertical?: boolean;
}

export interface IHandleState {
    /** whether slider handle is currently being dragged */
    isMoving?: boolean;
}

// props that require number values, for validation
const NUMBER_PROPS = ["max", "min", "stepSize", "tickSize", "value"];

/** Internal component for a Handle with click/drag/keyboard logic to determine a new value. */
export class Handle extends AbstractPureComponent<IInternalHandleProps, IHandleState> {
    public static displayName = "Blueprint2.SliderHandle";

    public state = {
        isMoving: false,
    };

    private handleElement: HTMLElement;
    private refHandlers = {
        handle: (el: HTMLSpanElement) => (this.handleElement = el),
    };

    public componentDidMount() {
        // The first time this component renders, it has no ref to the handle and thus incorrectly centers the handle.
        // Therefore, on the first mount, force a re-render to center the handle with the ref'd component.
        this.forceUpdate();
    }

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

        if (isNaN(pixelDelta)) {
            return value;
        }
        // convert pixels to range value in increments of `stepSize`
        return value + Math.round(pixelDelta / (tickSize * stepSize)) * stepSize;
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

    protected validateProps(props: IInternalHandleProps) {
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
        // always invoke onRelease; changeValue may call onChange if value is different
        const { onRelease } = this.props;
        const finalValue = this.changeValue(this.clientToValue(clientPixel));
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
        return newValue;
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
