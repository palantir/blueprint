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

import {
    Button,
    ButtonGroup,
    H5,
    Label,
    NonIdealState,
    NonIdealStateIconSize,
    Spinner,
    Switch,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";

import { IconSelect } from "./common/iconSelect";
import { Layout, LayoutSelect } from "./common/layoutSelect";
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
    icon: IconName;
    iconSize: NonIdealStateIconSize;
    layout: Layout;
    showAction: boolean;
    showDescription: boolean;
    showTitle: boolean;
    visual: VisualKind;
}

export class NonIdealStateExample extends React.PureComponent<IExampleProps, INonIdealStateExampleState> {
    public state: INonIdealStateExampleState = {
        icon: defaultIcon,
        iconSize: NonIdealStateIconSize.STANDARD,
        layout: "vertical",
        showAction: true,
        showDescription: true,
        showTitle: true,
        visual: "icon",
    };

    private toggleShowAction = handleBooleanChange(showAction => this.setState({ showAction }));

    private toggleShowDescription = handleBooleanChange(showDescription => this.setState({ showDescription }));

    private toggleShowTitle = handleBooleanChange(showTitle => this.setState({ showTitle }));

    private handleIconNameChange = (icon: IconName) => this.setState({ icon });

    private handleLayoutChange = (layout: Layout) => this.setState({ layout });

    private handleSizeChange = (size: Size) => this.setState({ iconSize: sizeToNonIdealStateIconSize[size] });

    private handleVisualKindChange = (visual: VisualKind) => this.setState({ visual });

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <LayoutSelect layout={this.state.layout} onChange={this.handleLayoutChange} />
                <VisualSelect visual={this.state.visual} onChange={this.handleVisualKindChange} />
                <IconSelect
                    disabled={this.state.visual !== "icon"}
                    iconName={this.state.icon}
                    onChange={this.handleIconNameChange}
                />
                <SizeSelect
                    label="Visual size"
                    optionLabels={["XS", "Small", "Standard"]}
                    size={nonIdealStateIconSizeToSize[this.state.iconSize]}
                    onChange={this.handleSizeChange}
                />
                <Switch label="Show title" checked={this.state.showTitle} onChange={this.toggleShowTitle} />
                <Switch
                    label="Show description"
                    checked={this.state.showDescription}
                    onChange={this.toggleShowDescription}
                />
                <Switch label="Show action" checked={this.state.showAction} onChange={this.toggleShowAction} />
            </>
        );

        const visual = this.state.visual === "icon" ? this.state.icon : <Spinner size={this.state.iconSize} />;
        const action = <Button outlined={true} text="New file" icon="plus" intent="primary" />;
        const description = (
            <div>
                Your search didn't match any files.
                <br />
                Try searching for something else, or create a new file.
            </div>
        );

        return (
            <Example options={options} {...this.props}>
                <NonIdealState
                    icon={visual}
                    iconSize={this.state.iconSize}
                    title={this.state.showTitle ? "No search results" : undefined}
                    description={this.state.showDescription ? description : undefined}
                    action={this.state.showAction ? action : undefined}
                    layout={this.state.layout}
                />
            </Example>
        );
    }
}

type VisualKind = "icon" | "spinner";

/** Button radio group to switch between icon and spinner visuals. */
const VisualSelect: React.FC<{ visual: VisualKind; onChange: (option: VisualKind) => void }> = ({
    visual,
    onChange,
}) => {
    const handleIcon = React.useCallback(() => onChange("icon"), []);
    const handleSpinner = React.useCallback(() => onChange("spinner"), []);

    return (
        <Label>
            Visual
            <ButtonGroup fill={true} style={{ marginTop: 5 }}>
                <Button active={visual === "icon"} text="Icon" onClick={handleIcon} />
                <Button active={visual === "spinner"} text="Spinner" onClick={handleSpinner} />
            </ButtonGroup>
        </Label>
    );
};
