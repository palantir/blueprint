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

import { H5, InputGroup, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

export const SearchInputExample: React.FC<ExampleProps> = props => {
    const [disabled, setDisabled] = React.useState(false);
    const [large, setLarge] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(false);
    const [small, setSmall] = React.useState(false);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch checked={readOnly} label="Read-only" onChange={handleBooleanChange(setReadOnly)} />
            <Switch checked={large} label="Large" onChange={handleBooleanChange(setLarge)} />
            <Switch checked={small} label="Small" onChange={handleBooleanChange(setSmall)} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <InputGroup
                disabled={disabled}
                large={large}
                placeholder="Search..."
                readOnly={readOnly}
                small={small}
                type="search"
            />
        </Example>
    );
};
