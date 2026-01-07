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

import { Button, ControlGroup, HTMLSelect, InputGroup, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

const FILTER_OPTIONS = [
    "Filter",
    "Name - ascending",
    "Name - descending",
    "Price - ascending",
    "Price - descending",
];

export const ControlGroupExample: React.FC<ExampleProps> = props => {
    const [fill, setFill] = useState(false);
    const [vertical, setVertical] = useState(false);

    const options = (
        <>
            <Switch checked={fill} label="Fill" onChange={handleBooleanChange(setFill)} />
            <Switch
                checked={vertical}
                label="Vertical"
                onChange={handleBooleanChange(setVertical)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <ControlGroup fill={fill} vertical={vertical}>
                <HTMLSelect options={FILTER_OPTIONS} />
                <InputGroup placeholder="Find filters..." />
                <Button icon="arrow-right" />
            </ControlGroup>
        </Example>
    );
};
