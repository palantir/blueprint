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
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Intent } from "../../common";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { ISliderBaseProps, MultiSlider } from "./multiSlider";

export type NumberRange = [number, number];

enum RangeIndex {
    START = 0,
    END = 1,
}

// eslint-disable-next-line deprecation/deprecation
export type RangeSliderProps = IRangeSliderProps;
/** @deprecated use RangeSliderProps */
export interface IRangeSliderProps extends ISliderBaseProps {
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
}

@polyfill
export class RangeSlider extends AbstractPureComponent2<RangeSliderProps> {
    public static defaultProps: RangeSliderProps = {
        ...MultiSlider.defaultSliderProps,
        intent: Intent.PRIMARY,
        value: [0, 10],
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.RangeSlider`;

    public render() {
        const { value, ...props } = this.props;
        return (
            <MultiSlider {...props}>
                <MultiSlider.Handle value={value![RangeIndex.START]} type="start" intentAfter={props.intent} />
                <MultiSlider.Handle value={value![RangeIndex.END]} type="end" />
            </MultiSlider>
        );
    }

    protected validateProps(props: RangeSliderProps) {
        const { value } = props;
        if (value == null || value[RangeIndex.START] == null || value[RangeIndex.END] == null) {
            throw new Error(Errors.RANGESLIDER_NULL_VALUE);
        }
    }
}
