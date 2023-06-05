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
import { DocsExampleProps, Example, handleBooleanChange } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";

import { IconSelect } from "./common/iconSelect";
import { IntentSelect } from "./common/intentSelect";

interface CalloutExampleState {
    icon?: IconName;
    intent?: Intent;
    showHeader: boolean;
}

export class CalloutExample extends React.PureComponent<DocsExampleProps, CalloutExampleState> {
    public state: CalloutExampleState = { showHeader: true };

    private handleHeaderChange = handleBooleanChange((showHeader: boolean) => this.setState({ showHeader }));

    private handleIconNameChange = (icon: IconName) => this.setState({ icon });

    private handleIntentChange = (intent: Intent) => this.setState({ intent });

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
                    Long-form information about the important content. This text is styled as{" "}
                    <a href="#core/typography.running-text">"Running text"</a>, so it may contain things like headers,
                    links, lists, <Code>code</Code> etc.
                </Callout>
            </Example>
        );
    }
}
