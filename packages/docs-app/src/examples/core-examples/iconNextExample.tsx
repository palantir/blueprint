/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import {
    FormGroup,
    H5,
    IconNext,
    Intent,
    Label,
    SegmentedControl,
    Slider,
} from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import {
    type BlueprintIconsNext,
    IconNextNames,
    IconSize,
    type NextIconVariant,
} from "@blueprintjs/icons/next";

import { IconNextSelect } from "./common/iconNextSelect";
import { IntentSelect } from "./common/intentSelect";

const MAX_ICON_SIZE = 100;

const iconSizeLabelId = "icon-next-size-label";

const VARIANT_OPTIONS = [
    { label: "Outlined", value: "outlined" },
    { label: "Filled", value: "filled" },
];

export const IconNextExample: React.FC<ExampleProps> = props => {
    const [icon, setIcon] = useState<BlueprintIconsNext>(IconNextNames.Star);
    const [variant, setVariant] = useState<NextIconVariant>("outlined");
    const [iconSize, setIconSize] = useState<number>(IconSize.STANDARD);
    const [intent, setIntent] = useState<Intent>(Intent.NONE);

    const options = (
        <>
            <H5>Props</H5>
            <IconNextSelect iconName={icon} onChange={handleIconChange} />
            <IntentSelect intent={intent} onChange={setIntent} />
            <FormGroup label="Variant">
                <SegmentedControl
                    fill={true}
                    onValueChange={value => setVariant(value as NextIconVariant)}
                    options={VARIANT_OPTIONS}
                    value={variant}
                />
            </FormGroup>
            <Label id={iconSizeLabelId}>Icon size</Label>
            <Slider
                handleHtmlProps={{ "aria-labelledby": iconSizeLabelId }}
                labelStepSize={MAX_ICON_SIZE / 5}
                max={MAX_ICON_SIZE}
                min={0}
                onChange={setIconSize}
                showTrackFill={false}
                value={iconSize}
            />
        </>
    );

    function handleIconChange(nextIcon?: BlueprintIconsNext) {
        if (nextIcon != null) {
            setIcon(nextIcon);
        }
    }

    return (
        <Example options={options} {...props}>
            <IconNext icon={icon} intent={intent} size={iconSize} variant={variant} />
        </Example>
    );
};
