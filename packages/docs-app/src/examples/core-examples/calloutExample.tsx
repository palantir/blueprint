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

import { Button, Callout, Code, H5, HTMLSelect, Intent, Label, Switch } from "@blueprintjs/core";
import { DocsExampleProps, Example, handleBooleanChange, handleNumberChange } from "@blueprintjs/docs-theme";
import type { IconName } from "@blueprintjs/icons";

import { IconSelect } from "./common/iconSelect";
import { IntentSelect } from "./common/intentSelect";

interface CalloutExampleState {
    contentIndex?: number;
    icon?: IconName;
    intent?: Intent;
    showTitle: boolean;
}

export class CalloutExample extends React.PureComponent<DocsExampleProps, CalloutExampleState> {
    public state: CalloutExampleState = {
        contentIndex: 0,
        showTitle: true,
    };

    private handleContentIndexChange = handleNumberChange(contentIndex => this.setState({ contentIndex }));

    private handleIconNameChange = (icon: IconName) => this.setState({ icon });

    private handleIntentChange = (intent: Intent) => this.setState({ intent });

    private handleShowTitleChange = handleBooleanChange((showTitle: boolean) => this.setState({ showTitle }));

    public render() {
        const { contentIndex, showTitle, ...calloutProps } = this.state;
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={showTitle} label="Title" onChange={this.handleShowTitleChange} />
                <IntentSelect intent={calloutProps.intent} onChange={this.handleIntentChange} showClearButton={true} />
                <IconSelect iconName={calloutProps.icon} onChange={this.handleIconNameChange} />
                <H5>Children</H5>
                <Label>
                    Example content
                    <HTMLSelect value={contentIndex} onChange={this.handleContentIndexChange}>
                        <option value="0">Text with formatting</option>
                        <option value="1">Simple text string</option>
                        <option value="2">Button</option>
                        <option value="3">Empty</option>
                    </HTMLSelect>
                </Label>
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <Callout {...calloutProps} title={showTitle ? "Visually important content" : undefined}>
                    {this.renderChildren(contentIndex)}
                </Callout>
            </Example>
        );
    }

    /* eslint-disable react/jsx-key */
    private renderChildren(contentIndex: number) {
        return [
            <React.Fragment>
                Long-form information about the important content. This text is styled as{" "}
                <a href="#core/typography.running-text">"Running text"</a>, so it may contain things like headers,
                links, lists, <Code>code</Code> etc.
            </React.Fragment>,
            "Long-form information about the important content",
            <Button text="Example button" intent="primary" />,
            undefined,
        ][contentIndex];
    }
}
