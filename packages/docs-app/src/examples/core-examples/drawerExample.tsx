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

import * as React from "react";

import {
    Button,
    Classes,
    Code,
    Divider,
    Drawer,
    H5,
    HTMLSelect,
    IOptionProps,
    Label,
    Position,
    Switch,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IBlueprintExampleData } from "../../tags/reactExamples";

export interface IDrawerExampleState {
    autoFocus: boolean;
    canEscapeKeyClose: boolean;
    canOutsideClickClose: boolean;
    enforceFocus: boolean;
    hasBackdrop: boolean;
    isOpen: boolean;
    position?: Position;
    size: string;
    usePortal: boolean;
}
export class DrawerExample extends React.PureComponent<IExampleProps<IBlueprintExampleData>, IDrawerExampleState> {
    public state: IDrawerExampleState = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        isOpen: false,
        position: Position.RIGHT,
        size: undefined,
        usePortal: true,
    };

    private handleAutoFocusChange = handleBooleanChange(autoFocus => this.setState({ autoFocus }));
    private handleBackdropChange = handleBooleanChange(hasBackdrop => this.setState({ hasBackdrop }));
    private handleEnforceFocusChange = handleBooleanChange(enforceFocus => this.setState({ enforceFocus }));
    private handleEscapeKeyChange = handleBooleanChange(canEscapeKeyClose => this.setState({ canEscapeKeyClose }));
    private handleUsePortalChange = handleBooleanChange(usePortal => this.setState({ usePortal }));
    private handlePositionChange = handleStringChange((position: Position) => this.setState({ position }));
    private handleOutsideClickChange = handleBooleanChange(val => this.setState({ canOutsideClickClose: val }));
    private handleSizeChange = handleStringChange(size => this.setState({ size }));

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Button onClick={this.handleOpen}>Show Drawer</Button>
                <Drawer
                    className={this.props.data.themeName}
                    icon="info-sign"
                    onClose={this.handleClose}
                    title="Palantir Foundry"
                    {...this.state}
                >
                    <div className={Classes.DRAWER_BODY}>
                        <div className={Classes.DIALOG_BODY}>
                            <p>
                                <strong>
                                    Data integration is the seminal problem of the digital age. For over ten years,
                                    we’ve helped the world’s premier organizations rise to the challenge.
                                </strong>
                            </p>
                            <p>
                                Palantir Foundry radically reimagines the way enterprises interact with data by
                                amplifying and extending the power of data integration. With Foundry, anyone can source,
                                fuse, and transform data into any shape they desire. Business analysts become data
                                engineers — and leaders in their organization’s data revolution.
                            </p>
                            <p>
                                Foundry’s back end includes a suite of best-in-class data integration capabilities: data
                                provenance, git-style versioning semantics, granular access controls, branching,
                                transformation authoring, and more. But these powers are not limited to the back-end IT
                                shop.
                            </p>
                            <p>
                                In Foundry, tables, applications, reports, presentations, and spreadsheets operate as
                                data integrations in their own right. Access controls, transformation logic, and data
                                quality flow from original data source to intermediate analysis to presentation in real
                                time. Every end product created in Foundry becomes a new data source that other users
                                can build upon. And the enterprise data foundation goes where the business drives it.
                            </p>
                            <p>Start the revolution. Unleash the power of data integration with Palantir Foundry.</p>
                        </div>
                    </div>
                    <div className={Classes.DRAWER_FOOTER}>Footer</div>
                </Drawer>
            </Example>
        );
    }

    private renderOptions() {
        const { autoFocus, enforceFocus, canEscapeKeyClose, canOutsideClickClose, hasBackdrop, usePortal } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Label>
                    Position
                    <HTMLSelect
                        value={this.state.position}
                        onChange={this.handlePositionChange}
                        options={VALID_POSITIONS}
                    />
                </Label>
                <Label>
                    Size
                    <HTMLSelect options={SIZES} onChange={this.handleSizeChange} />
                </Label>
                <Divider />
                <Switch checked={autoFocus} label="Auto focus" onChange={this.handleAutoFocusChange} />
                <Switch checked={enforceFocus} label="Enforce focus" onChange={this.handleEnforceFocusChange} />
                <Switch checked={hasBackdrop} label="Has backdrop" onChange={this.handleBackdropChange} />
                <Switch checked={usePortal} onChange={this.handleUsePortalChange}>
                    Use <Code>Portal</Code>
                </Switch>
                <Switch
                    checked={canOutsideClickClose}
                    label="Click outside to close"
                    onChange={this.handleOutsideClickChange}
                />
                <Switch checked={canEscapeKeyClose} label="Escape key to close" onChange={this.handleEscapeKeyChange} />
            </>
        );
    }

    private handleOpen = () => this.setState({ isOpen: true });
    private handleClose = () => this.setState({ isOpen: false });
}

const SIZES: Array<string | IOptionProps> = [
    { label: "Default", value: undefined },
    { label: "Small", value: Drawer.SIZE_SMALL },
    { label: "Standard", value: Drawer.SIZE_STANDARD },
    { label: "Large", value: Drawer.SIZE_LARGE },
    "72%",
    "560px",
];

const VALID_POSITIONS: Position[] = [Position.TOP, Position.RIGHT, Position.BOTTOM, Position.LEFT];
