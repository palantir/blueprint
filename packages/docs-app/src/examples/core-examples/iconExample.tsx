/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, Icon, Slider } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";
import { IconSelect } from "./common/iconSelect";

export interface IIconExampleState {
    icon: IconName;
    iconSize: number;
}

export class IconExample extends BaseExample<IIconExampleState> {
    public state: IIconExampleState = {
        icon: "calendar",
        iconSize: Icon.SIZE_STANDARD,
    };

    protected renderExample() {
        return (
            <div className="docs-icon-example" style={{ height: MAX_ICON_SIZE, width: MAX_ICON_SIZE }}>
                <Icon {...this.state} />
            </div>
        );
    }

    protected renderOptions() {
        const { icon, iconSize } = this.state;
        return [
            [<IconSelect key="icon-name" icon={icon} onChange={this.handleIconNameChange} />],
            [
                <label className={Classes.LABEL} key="icon-size-label">
                    Icon size
                </label>,
                <Slider
                    key="icon-size"
                    labelStepSize={MAX_ICON_SIZE / 5}
                    min={0}
                    max={MAX_ICON_SIZE}
                    showTrackFill={false}
                    value={iconSize}
                    onChange={this.handleIconSizeChange}
                />,
            ],
        ];
    }

    private handleIconSizeChange = (iconSize: number) => this.setState({ iconSize });

    private handleIconNameChange = (icon: IconName) => this.setState({ icon });
}

const MAX_ICON_SIZE = 100;
