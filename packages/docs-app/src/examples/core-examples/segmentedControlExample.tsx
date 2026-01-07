/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { useCallback, useState } from "react";

import {
    Divider,
    FormGroup,
    H5,
    SegmentedControl,
    type SegmentedControlIntent,
    type Size,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

import { SizeSelect } from "./common/sizeSelect";

export const SegmentedControlExample: React.FC<ExampleProps> = props => {
    const [disabled, setDisabled] = useState(false);
    const [fill, setFill] = useState(false);
    const [inline, setInline] = useState(false);
    const [intent, setIntent] = useState<SegmentedControlIntent>("none");
    const [size, setSize] = useState<Size>("medium");
    const [withIcons, setWithIcons] = useState(false);

    const handleIntentChange = useCallback(
        (newIntent: string) => setIntent(newIntent as SegmentedControlIntent),
        [],
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={inline} label="Inline" onChange={handleBooleanChange(setInline)} />
            <Switch checked={fill} label="Fill" onChange={handleBooleanChange(setFill)} />
            <Switch
                checked={withIcons}
                label="Icons"
                onChange={handleBooleanChange(setWithIcons)}
            />
            <Switch
                checked={disabled}
                label="Disabled"
                onChange={handleBooleanChange(setDisabled)}
            />
            <Divider />
            <FormGroup label="Intent">
                <SegmentedControl
                    defaultValue="none"
                    inline={true}
                    options={[
                        { label: "None", value: "none" },
                        { label: "Primary", value: "primary" },
                    ]}
                    onValueChange={handleIntentChange}
                    size="small"
                />
            </FormGroup>
            <SizeSelect size={size} onChange={setSize} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <SegmentedControl
                defaultValue="list"
                disabled={disabled}
                fill={fill}
                inline={inline}
                intent={intent}
                options={[
                    { icon: withIcons ? IconNames.LIST : undefined, label: "List", value: "list" },
                    { icon: withIcons ? IconNames.GRID : undefined, label: "Grid", value: "grid" },
                    {
                        disabled: true,
                        icon: withIcons ? IconNames.DISABLE : undefined,
                        label: "Disabled",
                        value: "disabled",
                    },
                    {
                        icon: withIcons ? IconNames.MEDIA : undefined,
                        label: "Gallery",
                        value: "gallery",
                    },
                ]}
                size={size}
            />
        </Example>
    );
};
