/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { type Alignment, AnchorButton, Button, Code, Divider, H5, Intent, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Duplicate, Refresh } from "@blueprintjs/icons";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { AlignmentSelect } from "./common/alignmentSelect";
import { IntentSelect } from "./common/intentSelect";
import { type Size, SizeSelect } from "./common/sizeSelect";

interface ButtonPlaygroundExampleState {
    active: boolean;
    alignText: Alignment | undefined;
    disabled: boolean;
    ellipsizeText: boolean;
    fill: boolean;
    iconOnly: boolean;
    intent: Intent;
    loading: boolean;
    longText: boolean;
    minimal: boolean;
    outlined: boolean;
    size: Size;
    wiggling: boolean;
}

export class ButtonPlaygroundExample extends React.PureComponent<ExampleProps, ButtonPlaygroundExampleState> {
    public state: ButtonPlaygroundExampleState = {
        active: false,
        alignText: undefined,
        disabled: false,
        ellipsizeText: false,
        fill: false,
        iconOnly: false,
        intent: Intent.NONE,
        loading: false,
        longText: false,
        minimal: false,
        outlined: false,
        size: "regular",
        wiggling: false,
    };

    private handleActiveChange = handleBooleanChange(active => this.setState({ active }));

    private handleAlignTextChange = (alignText: Alignment) => this.setState({ alignText });

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleEllipsizeTextChange = handleBooleanChange(ellipsizeText => this.setState({ ellipsizeText }));

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));

    private handleIconOnlyChange = handleBooleanChange(iconOnly => this.setState({ iconOnly }));

    private handleIntentChange = (intent: Intent) => this.setState({ intent });

    private handleLoadingChange = handleBooleanChange(loading => this.setState({ loading }));

    private handleLongTextChange = handleBooleanChange(longText => this.setState({ longText }));

    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));

    private handleOutlinedChange = handleBooleanChange(outlined => this.setState({ outlined }));

    private handleSizeChange = (size: Size) => this.setState({ size });

    private wiggleTimeoutId: number;

    private get wiggleButtonText() {
        return this.state.iconOnly
            ? undefined
            : this.state.longText
              ? "Click to trigger a whimsical wiggling animation"
              : "Click to wiggle";
    }

    private get duplicateButtonText() {
        return this.state.iconOnly
            ? undefined
            : this.state.longText
              ? "Duplicate this web page in a new browser tab"
              : "Duplicate this page";
    }

    public componentWillUnmount() {
        window.clearTimeout(this.wiggleTimeoutId);
    }

    public render() {
        const { iconOnly, longText, wiggling, size, ...buttonProps } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Active" checked={this.state.active} onChange={this.handleActiveChange} />
                <Switch label="Disabled" checked={this.state.disabled} onChange={this.handleDisabledChange} />
                <Switch label="Loading" checked={this.state.loading} onChange={this.handleLoadingChange} />
                <Switch label="Minimal" checked={this.state.minimal} onChange={this.handleMinimalChange} />
                <Switch label="Outlined" checked={this.state.outlined} onChange={this.handleOutlinedChange} />
                <Switch label="Fill" checked={this.state.fill} onChange={this.handleFillChange} />
                <PropCodeTooltip snippet={`ellipsizeText={${this.state.ellipsizeText.toString()}}`}>
                    <Switch
                        label="Ellipsize long text"
                        checked={this.state.ellipsizeText}
                        onChange={this.handleEllipsizeTextChange}
                    />
                </PropCodeTooltip>
                <Divider />
                <AlignmentSelect align={this.state.alignText} onChange={this.handleAlignTextChange} />
                <SizeSelect size={this.state.size} onChange={this.handleSizeChange} />
                <IntentSelect intent={this.state.intent} onChange={this.handleIntentChange} />
                <H5>Example</H5>
                <Switch label="Icons only" checked={this.state.iconOnly} onChange={this.handleIconOnlyChange} />
                <Switch label="Long text" checked={longText} onChange={this.handleLongTextChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <div className={classNames({ "docs-flex-column": this.state.fill })}>
                    <p>
                        <Code>Button</Code>
                    </p>
                    <Button
                        className={this.state.wiggling ? "docs-wiggle" : ""}
                        icon={<Refresh />}
                        onClick={this.beginWiggling}
                        small={size === "small"}
                        large={size === "large"}
                        text={this.wiggleButtonText}
                        {...buttonProps}
                    />
                </div>
                <div className={classNames({ "docs-flex-column": this.state.fill })}>
                    <p>
                        <Code>AnchorButton</Code>
                    </p>
                    <AnchorButton
                        href="#core/components/buttons"
                        icon={<Duplicate />}
                        rightIcon="share"
                        target="_blank"
                        text={this.duplicateButtonText}
                        small={size === "small"}
                        large={size === "large"}
                        {...buttonProps}
                    />
                </div>
            </Example>
        );
    }

    private beginWiggling = () => {
        window.clearTimeout(this.wiggleTimeoutId);
        this.setState({ wiggling: true });
        this.wiggleTimeoutId = window.setTimeout(() => this.setState({ wiggling: false }), 300);
    };
}
