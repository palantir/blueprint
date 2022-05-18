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

import { Alignment, AnchorButton, Button, ButtonGroup, Classes, H5, Icon, Intent, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleValueChange, IExampleProps } from "@blueprintjs/docs-theme";
import { Tooltip2 } from "@blueprintjs/popover2";

import { AlignmentSelect } from "./common/alignmentSelect";
import { IntentSelect } from "./common/intentSelect";

export interface IButtonGroupExampleState {
    alignText: Alignment;
    fill: boolean;
    iconOnly: boolean;
    intent: Intent;
    minimal: boolean;
    large: boolean;
    vertical: boolean;
}

export class ButtonGroupExample extends React.PureComponent<IExampleProps, IButtonGroupExampleState> {
    public state: IButtonGroupExampleState = {
        alignText: Alignment.CENTER,
        fill: false,
        iconOnly: false,
        intent: Intent.NONE,
        large: false,
        minimal: false,
        vertical: false,
    };

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));

    private handleIconOnlyChange = handleBooleanChange(iconOnly => this.setState({ iconOnly }));

    private handleIntentChange = handleValueChange((intent: Intent) => this.setState({ intent }));

    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));

    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));

    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    public render() {
        const { iconOnly, intent, ...bgProps } = this.state;
        // props for every button in the group
        const buttonProps = { intent };

        const intentLabelInfo = (
            <Tooltip2
                content={
                    <span className={Classes.TEXT_SMALL}>
                        Intents are set individually on each button <br />
                        in the group, not the ButtonGroup wrapper.
                    </span>
                }
                placement="top"
                minimal={true}
            >
                <span>
                    Intent{" "}
                    <span style={{ padding: 2, lineHeight: "16px", verticalAlign: "top" }}>
                        <Icon className={Classes.TEXT_MUTED} icon="info-sign" size={12} />
                    </span>
                </span>
            </Tooltip2>
        );
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={this.state.fill} label="Fill" onChange={this.handleFillChange} />
                <Switch checked={this.state.large} label="Large" onChange={this.handleLargeChange} />
                <Switch checked={this.state.minimal} label="Minimal" onChange={this.handleMinimalChange} />
                <Switch checked={this.state.vertical} label="Vertical" onChange={this.handleVerticalChange} />
                <IntentSelect intent={this.state.intent} label={intentLabelInfo} onChange={this.handleIntentChange} />
                <AlignmentSelect align={this.state.alignText} onChange={this.handleAlignChange} />
                <H5>Example</H5>
                <Switch checked={this.state.iconOnly} label="Icons only" onChange={this.handleIconOnlyChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                {/* set `minWidth` so `alignText` will have an effect when vertical */}
                <ButtonGroup style={{ minWidth: 200 }} {...bgProps}>
                    <Button {...buttonProps} icon="database" text={iconOnly ? undefined : "Queries"} />
                    <Button {...buttonProps} icon="function" text={iconOnly ? undefined : "Functions"} />
                    <AnchorButton
                        {...buttonProps}
                        icon="cog"
                        rightIcon="settings"
                        text={iconOnly ? undefined : "Options"}
                    />
                </ButtonGroup>
            </Example>
        );
    }

    private handleAlignChange = (alignText: Alignment) => this.setState({ alignText });
}
