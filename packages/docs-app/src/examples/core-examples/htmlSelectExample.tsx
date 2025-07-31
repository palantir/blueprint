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

import { Divider, FormGroup, H5, HTMLSelect, type HTMLSelectIconName, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";

const SUPPORTED_ICON_NAMES: HTMLSelectIconName[] = ["double-caret-vertical", "caret-down"];

const SELECT_OPTIONS = ["One", "Two", "Three", "Four"];

export const HTMLSelectExample: React.FC<ExampleProps> = props => {
    const [disabled, setDisabled] = useState(false);
    const [fill, setFill] = useState(false);
    const [iconName, setIconName] = useState<HTMLSelectIconName>(undefined);
    const [large, setLarge] = useState(false);
    const [minimal, setMinimal] = useState(false);

    const handleIconChange = handleStringChange(value => setIconName(value as HTMLSelectIconName));

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={fill} label="Fill" onChange={handleBooleanChange(setFill)} />
            <Switch checked={large} label="Large" onChange={handleBooleanChange(setLarge)} />
            <Switch checked={minimal} label="Minimal" onChange={handleBooleanChange(setMinimal)} />
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Divider />
            <FormGroup label="Icon">
                <HTMLSelect
                    onChange={handleIconChange}
                    options={SUPPORTED_ICON_NAMES}
                    placeholder="Choose an item..."
                />
            </FormGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            <HTMLSelect
                disabled={disabled}
                fill={fill}
                iconName={iconName}
                large={large}
                minimal={minimal}
                options={SELECT_OPTIONS}
            />
        </Example>
    );
};
