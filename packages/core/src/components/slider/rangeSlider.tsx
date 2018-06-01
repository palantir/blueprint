/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { SliderHandle } from "..";
import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { Intent } from "../../common/intent";
import { ICoreSliderProps, MultiSlider } from "./multiSlider";

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

export class RangeSlider extends AbstractPureComponent<IRangeSliderProps> {
    public static defaultProps: IRangeSliderProps = {
        ...MultiSlider.defaultCoreProps,
        value: [0, 10],
    };

    public static displayName = "Blueprint2.RangeSlider";

    public render() {
        const { value, className, ...props } = this.props;
        return (
            <MultiSlider {...props} className={classNames(Classes.RANGE_SLIDER, className)}>
                <SliderHandle value={value[RangeIndex.START]} type="start" intentAfter={Intent.PRIMARY} />
                <SliderHandle value={value[RangeIndex.END]} type="end" />
            </MultiSlider>
        );
    }

    protected validateProps(props: IRangeSliderProps) {
        const { value } = props;
        if (value == null || value[RangeIndex.START] == null || value[RangeIndex.END] == null) {
            throw new Error(Errors.RANGESLIDER_NULL_VALUE);
        }
    }
}
