/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
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
    };

    public displayName: "Blueprint.Slider";

    private handle: Handle;

    protected renderFill() {
        const initialValue = clamp(this.props.initialValue, this.props.min, this.props.max);
        let left = Math.round((initialValue - this.props.min) * this.state.tickSize);
        let width = Math.round((this.props.value - initialValue) * this.state.tickSize);
        if (width < 0) {
            left += width;
            width = Math.abs(width);
        }
        return <div className={`${Classes.SLIDER}-progress`} style={{ left, width }} />;
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

    private handleHandleRef = (ref: Handle) => {
        this.handle = ref;
    }
}

export let SliderFactory = React.createFactory(Slider);
