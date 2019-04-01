/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Callout, Code, H5, Intent, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IDocsExampleProps } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";
import { IconSelect } from "./common/iconSelect";
import { IntentSelect } from "./common/intentSelect";

export interface ICalloutExampleState {
    icon?: IconName;
    intent?: Intent;
    showHeader: boolean;
}

export class CalloutExample extends React.PureComponent<IDocsExampleProps, ICalloutExampleState> {
    public state: ICalloutExampleState = { showHeader: true };

    private handleHeaderChange = handleBooleanChange((showHeader: boolean) => this.setState({ showHeader }));
    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));

    public render() {
        const { showHeader, ...calloutProps } = this.state;
        const options = (
            <>
                <H5>Props</H5>
                <IntentSelect intent={calloutProps.intent} onChange={this.handleIntentChange} />
                <IconSelect iconName={calloutProps.icon} onChange={this.handleIconNameChange} />
                <H5>Example</H5>
                <Switch checked={showHeader} label="Show header" onChange={this.handleHeaderChange} />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <Callout {...calloutProps} title={showHeader ? "Visually important content" : undefined}>
                    The component is a simple wrapper around the CSS API that provides props for modifiers and optional
                    title element. Any additional HTML props will be spread to the rendered <Code>{"<div>"}</Code>{" "}
                    element.
                </Callout>
            </Example>
        );
    }

    private handleIconNameChange = (icon: IconName) => this.setState({ icon });
}
