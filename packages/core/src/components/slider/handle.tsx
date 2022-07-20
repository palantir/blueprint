/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2, Classes, Keys } from "../../common";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { clamp } from "../../common/utils";
import { HandleProps } from "./handleProps";
import { formatPercentage } from "./sliderUtils";

/**
 * Props for the internal <Handle> component needs some additional info from the parent Slider.
 */
export interface IInternalHandleProps extends HandleProps {
    disabled?: boolean;
    label: JSX.Element | string | undefined;
    max: number;
    min: number;
    stepSize: number;
    tickSize: number;
    tickSizeRatio: number;
    vertical: boolean;
}

export interface IHandleState {
    /** whether slider handle is currently being dragged */
    isMoving?: boolean;
}

// props that require number values, for validation
const NUMBER_PROPS = ["max", "min", "stepSize", "tickSize", "value"];

/** Internal component for a Handle with click/drag/keyboard logic to determine a new value. */

export class Handle extends AbstractPureComponent2<IInternalHandleProps, IHandleState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.SliderHandle`;

    public state = {
        isMoving: false,
    };

    private handleElement: HTMLElement | null = null;

    private refHandlers = {
        handle: (el: HTMLSpanElement) => (this.handleElement = el),
    };

    public componentDidMount() {
        // The first time this component renders, it has no ref to the handle and thus incorrectly centers the handle.
        // Therefore, on the first mount, force a re-render to center the handle with the ref'd component.
        this.forceUpdate();
    }

    public render() {
        const { className, disabled, label, min, max, value, vertical, htmlProps } = this.props;
        const { isMoving } = this.state;

        return (
            <span
                role="slider"
                tabIndex={0}
                {...htmlProps}
                className={classNames(Classes.SLIDER_HANDLE, { [Classes.ACTIVE]: isMoving }, className)}
                onKeyDown={disabled ? undefined : this.handleKeyDown}
                onKeyUp={disabled ? undefined : this.handleKeyUp}
                onMouseDown={disabled ? undefined : this.beginHandleMovement}
                onTouchStart={disabled ? undefined : this.beginHandleTouchMovement}
                ref={this.refHandlers.handle}
                style={this.getStyleProperties()}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-orientation={vertical ? "vertical" : "horizontal"}
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

    private getStyleProperties = (): React.CSSProperties => {
        if (this.handleElement == null) {
            return {};
        }

        // The handle midpoint of RangeSlider is actually shifted by a margin to
        // be on the edge of the visible handle element. Because the midpoint
        // calculation does not take this margin into account, we instead
        // measure the long side (which is equal to the short side plus the
        // margin).

        const { min = 0, tickSizeRatio, value, vertical } = this.props;
        const { handleMidpoint } = this.getHandleMidpointAndOffset(this.handleElement, true);
        const offsetRatio = (value - min) * tickSizeRatio;
        const offsetCalc = `calc(${formatPercentage(offsetRatio)} - ${handleMidpoint}px)`;
        return vertical ? { bottom: offsetCalc } : { left: offsetCalc };
    };

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
        const finalValue = this.changeValue(this.clientToValue(clientPixel));
        this.props.onRelease?.(finalValue);
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
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable-next-line deprecation/deprecation */
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
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable-next-line deprecation/deprecation */
        if ([Keys.ARROW_UP, Keys.ARROW_DOWN, Keys.ARROW_LEFT, Keys.ARROW_RIGHT].indexOf(event.which) >= 0) {
            this.props.onRelease?.(this.props.value);
        }
    };

    /** Clamp value and invoke callback if it differs from current value */
    private changeValue(newValue: number, callback = this.props.onChange) {
        newValue = this.clamp(newValue);
        if (!isNaN(newValue) && this.props.value !== newValue) {
            callback?.(newValue);
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
            ? useOppositeDimension
                ? "width"
                : "height"
            : useOppositeDimension
            ? "height"
            : "width";

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
