/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import { Intent } from "../../common/intent";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { ISliderBaseProps, MultiSlider } from "./multiSlider";

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

    public static displayName = `${DISPLAYNAME_PREFIX}.Slider`;

    public render() {
        const { initialValue, value, onChange, onRelease, ...props } = this.props;
        return (
            <MultiSlider {...props}>
                <MultiSlider.Handle
                    value={value}
                    intentAfter={value < initialValue ? Intent.PRIMARY : undefined}
                    intentBefore={value >= initialValue ? Intent.PRIMARY : undefined}
                    onChange={onChange}
                    onRelease={onRelease}
                />
                <MultiSlider.Handle value={initialValue} interactionKind="none" />
            </MultiSlider>
        );
    }
}
