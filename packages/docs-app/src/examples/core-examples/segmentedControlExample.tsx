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

import * as React from "react";

import { Divider, FormGroup, H5, SegmentedControl, type SegmentedControlIntent, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { type Size, SizeSelect } from "./common/sizeSelect";

export const SegmentedControlExample: React.FC<ExampleProps> = props => {
    const [intent, setIntent] = React.useState<SegmentedControlIntent>("none");
    const handleIntentChange = React.useCallback(newIntent => setIntent(newIntent as SegmentedControlIntent), []);

    const [inline, setInline] = React.useState<boolean>(false);
    const [fill, setFill] = React.useState<boolean>(false);
    const [compact, setCompact] = React.useState<boolean>(false);
    const [size, setSize] = React.useState<Size>("small");

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={inline} label="Inline" onChange={handleBooleanChange(setInline)} />
            <Switch checked={fill} label="Fill" onChange={handleBooleanChange(setFill)} />
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
            <Divider />
            <FormGroup label="Intent">
                <SegmentedControl
                    defaultValue="none"
                    inline={true}
                    options={[
                        {
                            label: "None",
                            value: "none",
                        },
                        {
                            label: "Primary",
                            value: "primary",
                        },
                    ]}
                    onValueChange={handleIntentChange}
                    small={true}
                />
            </FormGroup>
            <SizeSelect size={size} onChange={setSize} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <SegmentedControl
                compact={compact}
                defaultValue="list"
                fill={fill}
                inline={inline}
                intent={intent}
                options={[
                    {
                        label: "List",
                        value: "list",
                    },
                    {
                        label: "Grid",
                        value: "grid",
                    },
                    {
                        disabled: true,
                        label: "Disabled",
                        value: "disabled",
                    },
                    {
                        label: "Gallery",
                        value: "gallery",
                    },
                ]}
                large={size === "large"}
                small={size === "small"}
            />
        </Example>
    );
};
