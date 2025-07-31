/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useState } from "react";

import { H5, type NumberRange, RangeSlider, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

const INITIAL_RANGE: NumberRange = [36, 72];

const MIN_VALUE = 0;
const MAX_VALUE = 100;
const STEP_SIZE = 2;
const LABEL_STEP_SIZE = 20;

const htmlProps = { end: { "aria-label": "example end" }, start: { "aria-label": "example start" } };

export const RangeSliderExample: React.FC<ExampleProps> = props => {
    const [range, setRange] = useState<NumberRange>(INITIAL_RANGE);
    const [vertical, setVertical] = useState(false);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={vertical} label="Vertical" onChange={handleBooleanChange(setVertical)} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <RangeSlider
                handleHtmlProps={htmlProps}
                labelStepSize={LABEL_STEP_SIZE}
                max={MAX_VALUE}
                min={MIN_VALUE}
                onChange={setRange}
                stepSize={STEP_SIZE}
                value={range}
                vertical={vertical}
            />
        </Example>
    );
};
