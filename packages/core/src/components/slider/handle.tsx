/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { AbstractComponent } from "../../common/abstractComponent";
import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IProps } from "../../common/props";
import { clamp, safeInvoke } from "../../common/utils";

export interface IHandleProps extends IProps {
    disabled?: boolean;
    label: React.ReactChild;
    max: number;
    min: number;
    onChange?: (newValue: number) => void;
    onRelease?: (newValue: number) => void;
    stepSize: number;
    tickSize: number;
    value: number;
}

export interface IHandleState {
    /** whether slider handle is currently being dragged */
    isMoving?: boolean;
}

// props that require number values, for validation
const NUMBER_PROPS = ["max", "min", "stepSize", "tickSize", "value"];

@PureRender
export class Handle extends AbstractComponent<IHandleProps, IHandleState> {
    public static displayName = "Blueprint.SliderHandle";
    public state = {
        isMoving: false,
    };

    private handleElement: HTMLElement;
    private refHandlers = {
        handle: (el: HTMLSpanElement) => this.handleElement = el,
    };

    public render() {
        const { className, disabled, label, min, tickSize, value } = this.props;
        const { isMoving } = this.state;
        // getBoundingClientRect().height includes border size as opposed to clientHeight
        const handleSize = (this.handleElement == null ? 0 : this.handleElement.getBoundingClientRect().height);
        return (
            <span
                className={classNames(Classes.SLIDER_HANDLE, { [Classes.ACTIVE]: isMoving }, className)}
                onKeyDown={disabled ? null : this.handleKeyDown}
                onKeyUp={disabled ? null : this.handleKeyUp}
                onMouseDown={disabled ? null : this.beginHandleMovement}
                onTouchStart={disabled ? null : this.beginHandleTouchMovement}
                ref={this.refHandlers.handle}
                style={{ left: Math.round((value - min) * tickSize - handleSize / 2) }}
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
        const { stepSize, tickSize, value } = this.props;
        if (this.handleElement == null) { return value; }
        const handleRect = this.handleElement.getBoundingClientRect();
        const handleCenterPixel = handleRect.left + handleRect.width / 2;
        const pixelDelta = clientPixel - handleCenterPixel;
        // convert pixels to range value in increments of `stepSize`
        const valueDelta = Math.round(pixelDelta / (tickSize * stepSize)) * stepSize;
        return value + valueDelta;
    }

    public touchEventClientX(event: TouchEvent | React.TouchEvent<HTMLElement>) {
        return event.changedTouches[0].clientX;
    }

    public beginHandleMovement = (event: MouseEvent | React.MouseEvent<HTMLElement>) => {
        document.addEventListener("mousemove", this.handleHandleMovement);
        document.addEventListener("mouseup", this.endHandleMovement);
        this.setState({ isMoving: true });
        this.changeValue(this.clientToValue(event.clientX));
    }

    public beginHandleTouchMovement = (event: TouchEvent | React.TouchEvent<HTMLElement>) => {
        document.addEventListener("touchmove", this.handleHandleTouchMovement);
        document.addEventListener("touchend", this.endHandleTouchMovement);
        document.addEventListener("touchcancel", this.endHandleTouchMovement);
        this.setState({ isMoving: true });
        this.changeValue(this.clientToValue(this.touchEventClientX(event)));
    }

    protected validateProps(props: IHandleProps) {
        for (const prop of NUMBER_PROPS) {
            if (typeof (props as any)[prop] !== "number") {
                throw new Error(`Handle requires number for ${prop} prop`);
            }
        }
    }

    private endHandleMovement = (event: MouseEvent) => {
        this.handleMoveEndedAt(event.clientX);
    }

    private endHandleTouchMovement = (event: TouchEvent) => {
        this.handleMoveEndedAt(this.touchEventClientX(event));
    }

    private handleMoveEndedAt = (clientPixel: number) => {
        this.removeDocumentEventListeners();
        this.setState({ isMoving: false });
        // not using changeValue because we want to invoke the handler regardless of current prop value
        const { onRelease } = this.props;
        const finalValue = this.clamp(this.clientToValue(clientPixel));
        safeInvoke(onRelease, finalValue);
    }

    private handleHandleMovement = (event: MouseEvent) => {
        this.handleMovedTo(event.clientX);
    }

    private handleHandleTouchMovement = (event: TouchEvent) => {
        this.handleMovedTo(this.touchEventClientX(event));
    }

    private handleMovedTo = (clientPixel: number) => {
        if (this.state.isMoving && !this.props.disabled) {
            this.changeValue(this.clientToValue(clientPixel));
        }
    }

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
    }

    private handleKeyUp = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if ([Keys.ARROW_UP, Keys.ARROW_DOWN, Keys.ARROW_LEFT, Keys.ARROW_RIGHT].indexOf(event.which) >= 0) {
            safeInvoke(this.props.onRelease, this.props.value);
        }
    }

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

    private removeDocumentEventListeners() {
        document.removeEventListener("mousemove", this.handleHandleMovement);
        document.removeEventListener("mouseup", this.endHandleMovement);
        document.removeEventListener("touchmove", this.handleHandleTouchMovement);
        document.removeEventListener("touchend", this.endHandleTouchMovement);
        document.removeEventListener("touchcancel", this.endHandleTouchMovement);
    }
}
