/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { Colors, Icon, Intent, Tooltip } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { getTimezoneMetadata } from "@blueprintjs/timezone";
import React from "react";

export interface ICustomTimezonePickerTargetProps {
    timezone: string;
}

export interface ICustomTimezonePickerTargetState {
    isHovering: boolean;
}

// This is a little component that isn't meant to see the light of day outside
// the TimezonePickerExample. Coding style is thus a *little* scrappy.
export class CustomTimezonePickerTarget extends React.PureComponent<
    ICustomTimezonePickerTargetProps,
    ICustomTimezonePickerTargetState
> {
    public state: ICustomTimezonePickerTargetState = {
        isHovering: false,
    };

    public render() {
        const { isHovering } = this.state;
        return (
            <Tooltip content={this.getTooltipContent()}>
                <div
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    style={{ cursor: "pointer" }}
                >
                    <Icon icon={IconNames.GLOBE} intent={isHovering ? Intent.PRIMARY : undefined} />
                    &nbsp;
                    <Icon color={Colors.GRAY1} icon={IconNames.CARET_DOWN} />
                </div>
            </Tooltip>
        );
    }

    private getTooltipContent() {
        const { timezone } = this.props;

        if (timezone == null || timezone.length === 0) {
            return "No selection";
        }

        const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone);

        return (
            <span>
                GMT {offsetAsString}
                <span style={{ color: Colors.GRAY4 }}>{abbreviation ? ` (${abbreviation})` : ""}</span>
            </span>
        );
    }

    private handleMouseEnter = () => this.setState({ isHovering: true });
    private handleMouseLeave = () => this.setState({ isHovering: false });
}
