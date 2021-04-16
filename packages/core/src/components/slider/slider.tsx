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
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { ISliderBaseProps, MultiSlider } from "./multiSlider";

// eslint-disable-next-line deprecation/deprecation
export type SliderProps = ISliderProps;
/** @deprecated use SliderProps */
export interface ISliderProps extends ISliderBaseProps {
    /**
     * Initial value of the slider. This determines the other end of the
     * track fill: from `initialValue` to `value`.
     *
     * @default 0
     */
    initialValue?: number;

    /**
     * Value of slider.
     *
     * @default 0
     */
    value?: number;

    /** Callback invoked when the value changes. */
    onChange?(value: number): void;

    /** Callback invoked when the handle is released. */
    onRelease?(value: number): void;
}

@polyfill
export class Slider extends AbstractPureComponent2<SliderProps> {
    public static defaultProps: SliderProps = {
        ...MultiSlider.defaultSliderProps,
        initialValue: 0,
        intent: Intent.PRIMARY,
        value: 0,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Slider`;

    public render() {
        const { initialValue, intent, value, onChange, onRelease, ...props } = this.props;
        return (
            <MultiSlider {...props}>
                <MultiSlider.Handle
                    value={value!}
                    intentAfter={value! < initialValue! ? intent : undefined}
                    intentBefore={value! >= initialValue! ? intent : undefined}
                    onChange={onChange}
                    onRelease={onRelease}
                />
                <MultiSlider.Handle value={initialValue!} interactionKind="none" />
            </MultiSlider>
        );
    }
}
