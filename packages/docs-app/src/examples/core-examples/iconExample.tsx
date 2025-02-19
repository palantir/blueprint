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

import { H5, Icon, Intent, Label, Slider } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { type IconName, IconNames, IconSize } from "@blueprintjs/icons";

import { IconSelect } from "./common/iconSelect";
import { IntentSelect } from "./common/intentSelect";

const MAX_ICON_SIZE = 100;

const iconSizeLabelId = "icon-size-label";

export const IconExample: React.FC<ExampleProps> = props => {
    const [icon, setIcon] = React.useState<IconName>(IconNames.CALENDAR);
    const [iconSize, setIconSize] = React.useState<IconSize>(IconSize.STANDARD);
    const [intent, setIntent] = React.useState<Intent>(Intent.NONE);

    const options = (
        <>
            <H5>Props</H5>
            <IconSelect iconName={icon} onChange={setIcon} />
            <IntentSelect intent={intent} onChange={setIntent} />
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
            <Icon icon={icon} intent={intent} size={iconSize} />
        </Example>
    );
};
