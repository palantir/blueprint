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

import { FormGroup, H5, Intent, SegmentedControl } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { IntentSelect } from "./common/intentSelect";

export interface SegmentedControlState {
    intent: typeof Intent.NONE | typeof Intent.PRIMARY;
}

export class SegmentedControlExample extends React.PureComponent<ExampleProps, SegmentedControlState> {
    public state: SegmentedControlState = {
        intent: Intent.NONE,
    };

    // const handleIntentChange = React.useCallback((intent: string) => {

    // });

    public render() {
        const {} = this.state;

        const options = <>
            <H5>Props</H5>
            <FormGroup label="Intent">
                <SegmentedControl
                    options={[
                        {
                            id: "default",
                            label: "Default",
                        },
                        {
                            id: "primary",
                            label: "Primary",
                        },
                    ]}
                    defaultActiveOptionId={this.state.intent}
                />
            </FormGroup>
        </>;

        return (
            <Example options={options} {...this.props}>
                <SegmentedControl
                    options={[
                        {
                            id: "list",
                            label: "List",
                        },
                        {
                            id: "grid",
                            label: "Grid",
                        },
                        {
                            id: "gallery",
                            label: "Gallery",
                        },
                    ]}
                    on
                    defaultActiveOptionId="list"
                />
            </Example>
        );
    }
}
