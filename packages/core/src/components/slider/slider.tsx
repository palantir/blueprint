/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import { Intent } from "../../common/intent";
import * as Utils from "../../common/utils";
import { ISliderBaseProps, MultiSlider } from "./multiSlider";
import { SliderHandle } from "./sliderHandle";

export interface ISliderProps extends ISliderBaseProps {
    /**
     * Initial value of the slider. This determines the other end of the
     * track fill: from `initialValue` to `value`.
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

export class Slider extends AbstractPureComponent<ISliderProps> {
    public static defaultProps: ISliderProps = {
        ...MultiSlider.defaultSliderProps,
        initialValue: 0,
        value: 0,
    };

    public static displayName = "Blueprint2.Slider";

    public render() {
        const { initialValue, value, ...props } = this.props;
        return (
            <MultiSlider {...props} onChange={this.handleChange} onRelease={this.handleRelease}>
                <SliderHandle
                    value={value}
                    intentAfter={value < initialValue ? Intent.PRIMARY : undefined}
                    intentBefore={value >= initialValue ? Intent.PRIMARY : undefined}
                />
                <SliderHandle value={initialValue} interactionKind="none" />
            </MultiSlider>
        );
    }

    private handleChange = ([value]: number[]) => {
        Utils.safeInvoke(this.props.onChange, value);
    };

    private handleRelease = ([value]: number[]) => {
        Utils.safeInvoke(this.props.onRelease, value);
    };
}
