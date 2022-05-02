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

import * as React from "react";

import { Button, H5, NonIdealState, NonIdealStateIconSize, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";

import { IconSelect } from "./common/iconSelect";
import { Size, SizeSelect } from "./common/sizeSelect";

const sizeToNonIdealStateIconSize: Record<Size, NonIdealStateIconSize> = {
    large: NonIdealStateIconSize.STANDARD,
    regular: NonIdealStateIconSize.SMALL,
    small: NonIdealStateIconSize.EXTRA_SMALL,
};

const nonIdealStateIconSizeToSize: Record<NonIdealStateIconSize, Size> = Object.fromEntries(
    Object.entries(sizeToNonIdealStateIconSize).map(a => a.reverse()),
);

const defaultIcon: IconName = "search";

export interface INonIdealStateExampleState {
    action: boolean;
    description: boolean;
    icon: IconName | null;
    iconSize: NonIdealStateIconSize;
}

export class NonIdealStateExample extends React.PureComponent<IExampleProps, INonIdealStateExampleState> {
    public state: INonIdealStateExampleState = {
        action: true,
        description: true,
        icon: defaultIcon,
        iconSize: NonIdealStateIconSize.STANDARD,
    };

    private toggleAction = handleBooleanChange(action => this.setState({ action }));

    private toggleIcon = handleBooleanChange(icon => this.setState({ icon: icon ? defaultIcon : null }));

    private toggleDescription = handleBooleanChange(description => this.setState({ description }));

    private handleIconNameChange = (icon: IconName) => this.setState({ icon });

    private handleSizeChange = (size: Size) => this.setState({ iconSize: sizeToNonIdealStateIconSize[size] });

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Show icon" checked={this.state.icon !== null} onChange={this.toggleIcon} />
                <IconSelect
                    disabled={this.state.icon === null}
                    iconName={this.state.icon}
                    onChange={this.handleIconNameChange}
                />
                <SizeSelect
                    label="Icon size"
                    optionLabels={["XS", "Small", "Standard"]}
                    size={nonIdealStateIconSizeToSize[this.state.iconSize]}
                    onChange={this.handleSizeChange}
                />
                <Switch label="Show description" checked={this.state.description} onChange={this.toggleDescription} />
                <Switch label="Show action" checked={this.state.action} onChange={this.toggleAction} />
            </>
        );

        const action = <Button outlined={true} text="Add file" icon="plus" intent="primary" />;
        const description = (
            <>
                Your search didn't match any files.
                <br />
                Try searching for something else, or add a new file.
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <NonIdealState
                    icon={this.state.icon === null ? undefined : this.state.icon}
                    iconSize={this.state.iconSize}
                    title="No search results"
                    description={this.state.description ? description : undefined}
                    action={this.state.action ? action : undefined}
                />
            </Example>
        );
    }
}
