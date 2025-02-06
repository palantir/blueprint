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

import * as React from "react";

import { DISPLAYNAME_PREFIX, Intent } from "../../common";
import * as Errors from "../../common/errors";
import { useValidateProps } from "../../hooks/useValidateProps";

import type { HandleHtmlProps } from "./handleProps";
import { MultiSlider, type SliderBaseProps } from "./multiSlider";

export type NumberRange = [number, number];

enum RangeIndex {
    START = 0,
    END = 1,
}

export interface RangeSliderProps extends SliderBaseProps {
    /**
     * Range value of slider. Handles will be rendered at each position in the range.
     *
     * @default [0, 10]
     */
    value?: NumberRange;

    /** Callback invoked when the range value changes. */
    onChange?(value: NumberRange): void;

    /** Callback invoked when a handle is released. */
    onRelease?(value: NumberRange): void;

    /** HTML props to apply to the slider Handles */
    handleHtmlProps?: { start?: HandleHtmlProps; end?: HandleHtmlProps };
}

/**
 * Range slider component.
 *
 * @see https://blueprintjs.com/docs/#core/components/sliders.range-slider
 */
export const RangeSlider: React.FC<RangeSliderProps> = props => {
    const {
        disabled = false,
        handleHtmlProps,
        intent = Intent.PRIMARY,
        max = 10,
        min = 0,
        showTrackFill = true,
        stepSize = 1,
        value = [0, 10],
        vertical = false,
        ...rest
    } = props;

    useValidateProps(() => {
        if (value == null || value[RangeIndex.START] == null || value[RangeIndex.END] == null) {
            throw new Error(Errors.RANGESLIDER_NULL_VALUE);
        }
    }, [value]);

    return (
        <MultiSlider
            disabled={disabled}
            max={max}
            min={min}
            showTrackFill={showTrackFill}
            stepSize={stepSize}
            vertical={vertical}
            {...rest}
        >
            <MultiSlider.Handle
                htmlProps={handleHtmlProps?.start}
                intentAfter={intent}
                type="start"
                value={value![RangeIndex.START]}
            />
            <MultiSlider.Handle htmlProps={handleHtmlProps?.end} type="end" value={value![RangeIndex.END]} />
        </MultiSlider>
    );
};

RangeSlider.displayName = `${DISPLAYNAME_PREFIX}.RangeSlider`;
