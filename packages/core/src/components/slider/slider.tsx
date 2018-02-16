/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import * as Classes from "../../common/classes";
import { clamp } from "../../common/utils";
import { CoreSlider, ICoreSliderProps } from "./coreSlider";
import { Handle } from "./handle";

export interface ISliderProps extends ICoreSliderProps {
    /**
     * Initial value of the slider, determines where the fill starts from.
     * @default 0
     */
    initialValue?: number;

    /**
     * Value of slider.
     * @default 0
     */
    value?: number;

    /** Callback invoked when the value changes. */
    onChange?(value: number): void;

    /** Callback invoked when the handle is released. */
    onRelease?(value: number): void;
}

export class Slider extends CoreSlider<ISliderProps> {
    public static defaultProps: ISliderProps = {
        disabled: false,
        initialValue: 0,
        labelStepSize: 1,
        max: 10,
        min: 0,
        showTrackFill: true,
        stepSize: 1,
        value: 0,
        vertical: false,
    };

    public static displayName: "Blueprint.Slider";

    private handle: Handle;

    protected renderFill() {
        const { tickSize } = this.state;
        const initialValue = clamp(this.props.initialValue, this.props.min, this.props.max);

        let offset = Math.round((initialValue - this.props.min) * tickSize);
        let size = Math.round((this.props.value - initialValue) * tickSize);

        if (size < 0) {
            offset += size;
            size = Math.abs(size);
        }

        const style: React.CSSProperties = this.props.vertical
            ? { bottom: offset, height: size }
            : { left: offset, width: size };

        return <div className={`${Classes.SLIDER}-progress`} style={style} />;
    }

    protected renderHandles() {
        // make sure to *not* pass this.props.className to handle
        return (
            <Handle
                {...this.props}
                {...this.state}
                className=""
                label={this.formatLabel(this.props.value)}
                ref={this.handleHandleRef}
            />
        );
    }

    protected handleTrackClick(event: React.MouseEvent<HTMLElement>) {
        if (this.handle != null) {
            this.handle.beginHandleMovement(event);
        }
    }

    protected handleTrackTouch(event: React.TouchEvent<HTMLElement>) {
        if (this.handle != null) {
            this.handle.beginHandleTouchMovement(event);
        }
    }
    // tslint:enable member-ordering

    private handleHandleRef = (ref: Handle) => {
        this.handle = ref;
    };
}
