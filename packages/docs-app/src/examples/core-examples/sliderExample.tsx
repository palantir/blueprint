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

import { Card, H3, H5, Slider, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

export const SliderExample: React.FC<ExampleProps> = props => {
    const [value1, setValue1] = useState(2.5);
    const [value2, setValue2] = useState(0);
    const [value3, setValue3] = useState(30);
    const [vertical, setVertical] = useState(false);

    const options = (
        <>
            <H5>Props</H5>
            <Switch
                checked={vertical}
                label="Vertical"
                onChange={handleBooleanChange(setVertical)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Card style={{ flexDirection: vertical ? "row" : "column" }}>
                <Slider
                    handleHtmlProps={{ "aria-label": "example 1" }}
                    labelStepSize={10}
                    max={10}
                    min={0}
                    onChange={setValue1}
                    stepSize={0.1}
                    value={value1}
                    vertical={vertical}
                />
                <Slider
                    handleHtmlProps={{ "aria-label": "example 2" }}
                    labelRenderer={renderPercent}
                    labelStepSize={0.14}
                    max={0.7}
                    min={0}
                    onChange={setValue2}
                    stepSize={0.01}
                    value={value2}
                    vertical={vertical}
                />
                <Slider
                    handleHtmlProps={{ "aria-label": "example 3" }}
                    labelRenderer={renderCurrency}
                    labelStepSize={10}
                    max={48}
                    min={-12}
                    onChange={setValue3}
                    showTrackFill={false}
                    stepSize={6}
                    value={value3}
                    vertical={vertical}
                />
            </Card>

            {/* TODO: Remove this test section before merging PR - temporary demonstration of ensureParentOverflowVisible */}
            <div style={{ marginTop: "40px" }}>
                <H3 style={{ marginBottom: "10px" }}>Test: Slider in overflow container</H3>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                    Red box has overflow:hidden. Toggle "Ensure parent overflow visible" to test if
                    labels escape.
                </p>

                <div
                    style={{
                        border: "2px solid red",
                        height: "100px",
                        marginBottom: "20px",
                        overflow: "hidden",
                        padding: "40px 20px",
                    }}
                >
                    <p style={{ fontSize: "12px", marginBottom: "10px" }}>
                        Without ensureParentOverflowVisible (label will clip):
                    </p>
                    <Slider
                        handleHtmlProps={{ "aria-label": "overflow test without fix" }}
                        labelStepSize={2500}
                        max={10000}
                        min={0}
                        onChange={setValue1}
                        stepSize={100}
                        value={value1}
                        vertical={vertical}
                    />
                </div>

                <div
                    style={{
                        border: "2px solid green",
                        height: "100px",
                        overflow: "hidden",
                        padding: "40px 20px",
                    }}
                >
                    <p style={{ fontSize: "12px", marginBottom: "10px" }}>
                        With ensureParentOverflowVisible (label escapes):
                    </p>
                    <Slider
                        handleHtmlProps={{ "aria-label": "overflow test with fix" }}
                        labelStepSize={2500}
                        max={10000}
                        min={0}
                        onChange={setValue1}
                        stepSize={100}
                        value={value1}
                        vertical={vertical}
                        ensureParentOverflowVisible={true}
                    />
                </div>
            </div>
        </Example>
    );
};

const renderPercent = (value: number) => `${Math.round(value * 100)}%`;

const renderCurrency = (value: number) => (value === 0 ? `£${value}` : `£${value},000`);
