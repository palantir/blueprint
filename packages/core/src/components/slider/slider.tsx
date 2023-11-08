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

import { AbstractPureComponent, Intent } from "../../common";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import type { HandleHtmlProps } from "./handleProps";
import { MultiSlider, type SliderBaseProps } from "./multiSlider";

export interface SliderProps extends SliderBaseProps {
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

    /** A limited subset of HTML props to apply to the slider Handle */
    handleHtmlProps?: HandleHtmlProps;
}

/**
 * Slider component.
 *
 * @see https://blueprintjs.com/docs/#core/components/sliders.slider
 */
export class Slider extends AbstractPureComponent<SliderProps> {
    public static defaultProps: SliderProps = {
        ...MultiSlider.defaultSliderProps,
        initialValue: 0,
        intent: Intent.PRIMARY,
        value: 0,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Slider`;

    public render() {
        const { initialValue, intent, value, onChange, onRelease, handleHtmlProps, ...props } = this.props;
        return (
            <MultiSlider {...props}>
                <MultiSlider.Handle
                    value={value!}
                    intentAfter={value! < initialValue! ? intent : undefined}
                    intentBefore={value! >= initialValue! ? intent : undefined}
                    onChange={onChange}
                    onRelease={onRelease}
                    htmlProps={handleHtmlProps}
                />
                <MultiSlider.Handle value={initialValue!} interactionKind="none" />
            </MultiSlider>
        );
    }
}
