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

import * as React from "react";

import {
    H5,
    HandleInteractionKind,
    Intent,
    MultiSlider,
    MultiSliderHandle,
    Radio,
    RadioGroup,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

type ShownIntents = "danger" | "warning" | "both";

interface SliderValues {
    dangerStart: number;
    warningStart: number;
    warningEnd: number;
    dangerEnd: number;
}

const initialValues = {
    /* eslint-disable sort-keys */
    dangerStart: 12,
    warningStart: 36,
    warningEnd: 72,
    dangerEnd: 90,
    /* eslint-enable sort-keys */
};

export const MultiSliderExample: React.FC<ExampleProps> = props => {
    const [interactionKind, setInteractionKind] = React.useState<HandleInteractionKind>(HandleInteractionKind.PUSH);
    const [shownIntents, setShownIntents] = React.useState<ShownIntents>("both");
    const [showTrackFill, setShowTrackFill] = React.useState(true);
    const [values, setValues] = React.useState<SliderValues>(initialValues);
    const [vertical, setVertical] = React.useState<boolean>(false);

    const showDanger = shownIntents !== "warning";
    const showWarning = shownIntents !== "danger";

    const getUpdatedHandles = React.useCallback(
        (newValues: number[]): Partial<SliderValues> => {
            switch (shownIntents) {
                case "both": {
                    const [dangerStart, warningStart, warningEnd, dangerEnd] = newValues;
                    /* eslint-disable-next-line sort-keys */
                    return { dangerStart, warningStart, warningEnd, dangerEnd };
                }
                case "danger": {
                    const [dangerStart, dangerEnd] = newValues;
                    /* eslint-disable-next-line sort-keys */
                    return { dangerStart, dangerEnd };
                }
                case "warning": {
                    const [warningStart, warningEnd] = newValues;
                    /* eslint-disable-next-line sort-keys */
                    return { warningStart, warningEnd };
                }
            }
        },
        [shownIntents],
    );

    const handleChange = React.useCallback(
        (rawValues: number[]) => {
            // newValues is always in sorted order, and handled cannot be unsorted by dragging with lock/push interactions.
            const newValuesMap = { ...values, ...getUpdatedHandles(rawValues) };
            const newValues = Object.keys(newValuesMap).map((key: string) => newValuesMap[key as keyof SliderValues]);
            newValues.sort((a, b) => a - b);
            const [dangerStart, warningStart, warningEnd, dangerEnd] = newValues;
            /* eslint-disable-next-line sort-keys */
            setValues({ dangerStart, warningStart, warningEnd, dangerEnd });
        },
        [getUpdatedHandles, values],
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={vertical} label="Vertical" onChange={handleBooleanChange(setVertical)} />
            <Switch checked={showTrackFill} label="Show track fill" onChange={handleBooleanChange(setShowTrackFill)} />
            <H5>Handle interaction</H5>
            <RadioGroup selectedValue={interactionKind} onChange={handleValueChange(setInteractionKind)}>
                <Radio label="Lock" value={HandleInteractionKind.LOCK} />
                <Radio label="Push" value={HandleInteractionKind.PUSH} />
            </RadioGroup>
            <H5>Example</H5>
            <RadioGroup selectedValue={shownIntents} onChange={handleValueChange(setShownIntents)}>
                <Radio label="Outer handles" value="danger" />
                <Radio label="Inner handles" value="warning" />
                <Radio label="Both pairs" value="both" />
            </RadioGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            <MultiSlider
                defaultTrackIntent={Intent.SUCCESS}
                labelStepSize={20}
                max={100}
                min={0}
                onChange={handleChange}
                showTrackFill={showTrackFill}
                stepSize={2}
                vertical={vertical}
            >
                {/* up to four handles, toggle-able in pairs */}
                {showDanger && (
                    <MultiSliderHandle
                        htmlProps={{ "aria-label": "danger start" }}
                        intentBefore="danger"
                        interactionKind={interactionKind}
                        type="start"
                        value={values.dangerStart}
                    />
                )}
                {showWarning && (
                    <MultiSliderHandle
                        htmlProps={{ "aria-label": "warning start" }}
                        intentBefore="warning"
                        interactionKind={interactionKind}
                        type="start"
                        value={values.warningStart}
                    />
                )}
                {showWarning && (
                    <MultiSliderHandle
                        htmlProps={{ "aria-label": "warning end" }}
                        intentAfter="warning"
                        interactionKind={interactionKind}
                        type="end"
                        value={values.warningEnd}
                    />
                )}
                {showDanger && (
                    <MultiSliderHandle
                        htmlProps={{ "aria-label": "danger end" }}
                        intentAfter="danger"
                        interactionKind={interactionKind}
                        type="end"
                        value={values.dangerEnd}
                    />
                )}
            </MultiSlider>
        </Example>
    );
};
