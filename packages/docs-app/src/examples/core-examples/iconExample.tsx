/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, H5, Icon, Intent, Label, Slider } from "@blueprintjs/core";
import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";
import { IconSelect } from "./common/iconSelect";
import { IntentSelect } from "./common/intentSelect";

export interface IIconExampleState {
    icon: IconName;
    intent: Intent;
    iconSize: number;
}

export class IconExample extends React.PureComponent<IExampleProps, IIconExampleState> {
    public state: IIconExampleState = {
        icon: "calendar",
        iconSize: Icon.SIZE_STANDARD,
        intent: Intent.NONE,
    };

    public render() {
        const { icon, iconSize, intent } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <IconSelect iconName={icon} onChange={this.handleIconNameChange} />
                <Label text="Icon size" />
                <Slider
                    labelStepSize={MAX_ICON_SIZE / 5}
                    min={0}
                    max={MAX_ICON_SIZE}
                    showTrackFill={false}
                    value={iconSize}
                    onChange={this.handleIconSizeChange}
                />
                <H5>Example</H5>
                <IntentSelect intent={this.state.intent} onChange={this.handleIntentChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <Icon icon={icon} iconSize={iconSize} className={Classes.intentClass(intent)} />
            </Example>
        );
    }

    // tslint:disable-next-line:member-ordering
    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));
    private handleIconSizeChange = (iconSize: number) => this.setState({ iconSize });
    private handleIconNameChange = (icon: IconName) => this.setState({ icon });
}

const MAX_ICON_SIZE = 100;
