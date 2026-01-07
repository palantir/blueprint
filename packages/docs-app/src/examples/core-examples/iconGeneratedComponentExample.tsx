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

import { H5, Label, Slider } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Calendar, IconSize } from "@blueprintjs/icons";

const MAX_ICON_SIZE = 100;

const iconSizeLabelId = "icon-size-label";

export const IconGeneratedComponentExample: React.FC<ExampleProps> = props => {
    const [iconSize, setIconSize] = useState<IconSize>(IconSize.STANDARD);

    const options = (
        <>
            <H5>Props</H5>
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

    return (
        <Example options={options} {...props}>
            <Calendar size={iconSize} />
        </Example>
    );
};
