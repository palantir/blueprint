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

import { Card, H5, type Intent, Label, Slider, Spinner, SpinnerSize, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

const spinnerSizeLabelId = "spinner-size-label";

export const SpinnerExample: React.FC<ExampleProps> = props => {
    const [hasValue, setHasValue] = useState(false);
    const [intent, setIntent] = useState<Intent>();
    const [size, setSize] = useState(SpinnerSize.STANDARD);
    const [value, setValue] = useState(0.7);

    const options = (
        <>
            <H5>Props</H5>
            <IntentSelect intent={intent} onChange={setIntent} />
            <Label id={spinnerSizeLabelId}>Size</Label>
            <Slider
                handleHtmlProps={{ "aria-labelledby": spinnerSizeLabelId }}
                labelStepSize={50}
                max={SpinnerSize.LARGE * 2}
                min={0}
                onChange={setSize}
                showTrackFill={false}
                stepSize={5}
                value={size}
            />
            <Switch checked={hasValue} label="Known value" onChange={handleBooleanChange(setHasValue)} />
            <Slider
                disabled={!hasValue}
                handleHtmlProps={{ "aria-label": "spinner value" }}
                labelRenderer={renderLabel}
                labelStepSize={1}
                max={1}
                min={0}
                onChange={setValue}
                showTrackFill={false}
                stepSize={0.1}
                value={value}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Card>
                <Spinner
                    aria-label={hasValue ? `Loading ${value * 100}% complete` : "Loading..."}
                    intent={intent}
                    size={size}
                    value={hasValue ? value : null}
                />
            </Card>
        </Example>
    );
};

const renderLabel = (newValue: number) => newValue.toFixed(1);
