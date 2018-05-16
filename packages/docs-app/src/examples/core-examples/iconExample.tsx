/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Icon, Label, Slider } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";
import { IconSelect } from "./common/iconSelect";

export interface IIconExampleState {
    icon: IconName;
    iconSize: number;
}

export class IconExample extends React.PureComponent<IExampleProps, IIconExampleState> {
    public state: IIconExampleState = {
        icon: "calendar",
        iconSize: Icon.SIZE_STANDARD,
    };

    public render() {
        const { icon, iconSize } = this.state;

        const options = (
            <>
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
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <Icon icon={icon} iconSize={iconSize} />
            </Example>
        );
    }

    private handleIconSizeChange = (iconSize: number) => this.setState({ iconSize });
    private handleIconNameChange = (icon: IconName) => this.setState({ icon });
}

const MAX_ICON_SIZE = 100;
