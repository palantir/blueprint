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

import { FormGroup, H5, SegmentedControl, type SegmentedControlIntent } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

export const SegmentedControlExample: React.FC<ExampleProps> = props => {
    const [intent, setIntent] = React.useState<SegmentedControlIntent>("none");
    const handleActiveOptionChange = React.useCallback(
        activeOptionId => setIntent(activeOptionId as SegmentedControlIntent),
        [],
    );

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Intent">
                <SegmentedControl
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
                    defaultValue="none"
                    onChange={handleActiveOptionChange}
                />
            </FormGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            <SegmentedControl
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
                        label: "Gallery",
                        value: "gallery",
                    },
                ]}
                defaultValue="list"
                intent={intent}
            />
        </Example>
    );
};
