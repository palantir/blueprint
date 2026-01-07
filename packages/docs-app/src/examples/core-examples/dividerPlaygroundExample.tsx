/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { Button, ButtonGroup, Divider, H5, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

export const DividerPlaygroundExample: React.FC<ExampleProps> = props => {
    const [vertical, setVertical] = useState(false);
    const [compact, setCompact] = useState(false);

    const options = (
        <>
            <H5>Example props</H5>
            <Switch
                checked={vertical}
                label="Vertical"
                onChange={handleBooleanChange(setVertical)}
            />
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <ButtonGroup vertical={vertical} variant="minimal">
                <Button text="File" />
                <Button text="Edit" />
                <Divider compact={compact} />
                <Button text="Create" />
                <Button text="Delete" />
                <Divider compact={compact} />
                <Button icon="add" />
                <Button icon="remove" />
            </ButtonGroup>
        </Example>
    );
};
