/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
    ContextMenu,
    Divider,
    Drawer,
    DrawerSize,
    FormGroup,
    H5,
    HTMLSelect,
    Menu,
    MenuItem,
    type OptionProps,
    Position,
    SegmentedControl,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

import type { BlueprintExampleData } from "../../tags/types";

export const DrawerExample: React.FC<ExampleProps<BlueprintExampleData>> = props => {
    const [autoFocus, setAutoFocus] = React.useState(true);
    const [canEscapeKeyClose, setCanEscapeKeyClose] = React.useState(true);
    const [canOutsideClickClose, setCanOutsideClickClose] = React.useState(true);
    const [enforceFocus, setEnforceFocus] = React.useState(true);
    const [hasBackdrop, setHasBackdrop] = React.useState(true);
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState<Position>(Position.RIGHT);
    const [size, setSize] = React.useState<string | undefined>(undefined);
    const [usePortal, setUsePortal] = React.useState(true);

    const handlePositionChange = React.useCallback((value: string) => setPosition(value as Position), []);

    const handleOpen = React.useCallback(() => setIsOpen(true), []);

    const handleClose = React.useCallback(() => setIsOpen(false), []);

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Position">
                <SegmentedControl
                    fill={true}
                    onValueChange={handlePositionChange}
                    options={POSITION_OPTIONS}
                    size="small"
                    value={position}
                />
            </FormGroup>
            <FormGroup label="Size">
                <HTMLSelect options={SIZES} onChange={handleStringChange(setSize)} />
            </FormGroup>
            <Divider />
            <Switch checked={autoFocus} label="Auto focus" onChange={handleBooleanChange(setAutoFocus)} />
            <Switch checked={enforceFocus} label="Enforce focus" onChange={handleBooleanChange(setEnforceFocus)} />
            <Switch checked={hasBackdrop} label="Has backdrop" onChange={handleBooleanChange(setHasBackdrop)} />
            <Switch checked={usePortal} onChange={handleBooleanChange(setUsePortal)}>
                Use <Code>Portal</Code>
            </Switch>
            <Switch
                checked={canOutsideClickClose}
                label="Click outside to close"
                onChange={handleBooleanChange(setCanOutsideClickClose)}
            />
            <Switch
                checked={canEscapeKeyClose}
                label="Escape key to close"
                onChange={handleBooleanChange(setCanEscapeKeyClose)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Button onClick={handleOpen}>Show Drawer</Button>
            <Drawer
                autoFocus={autoFocus}
                canEscapeKeyClose={canEscapeKeyClose}
                canOutsideClickClose={canOutsideClickClose}
                className={props.data.themeName}
                enforceFocus={enforceFocus}
                hasBackdrop={hasBackdrop}
                icon={IconNames.INFO_SIGN}
                isOpen={isOpen}
                onClose={handleClose}
                position={position}
                size={size === "default" ? undefined : size}
                title="Palantir Foundry"
                usePortal={usePortal}
            >
                <div className={Classes.DRAWER_BODY}>
                    {/* HACKHACK: strange use of unrelated dialog class, should be refactored */}
                    <div className={Classes.DIALOG_BODY}>
                        <p>
                            <strong>
                                Data integration is the seminal problem of the digital age. For over ten years, we've
                                helped the world's premier organizations rise to the challenge.
                            </strong>
                        </p>
                        <p>
                            Palantir Foundry radically reimagines the way enterprises interact with data by amplifying
                            and extending the power of data integration. With Foundry, anyone can source, fuse, and
                            transform data into any shape they desire. Business analysts become data engineers — and
                            leaders in their organization's data revolution.
                        </p>
                        <p>
                            Foundry's back end includes a suite of best-in-class data integration capabilities: data
                            provenance, git-style versioning semantics, granular access controls, branching,
                            transformation authoring, and more. But these powers are not limited to the back-end IT
                            shop.
                        </p>
                        <p>
                            In Foundry, tables, applications, reports, presentations, and spreadsheets operate as data
                            integrations in their own right. Access controls, transformation logic, and data quality
                            flow from original data source to intermediate analysis to presentation in real time. Every
                            end product created in Foundry becomes a new data source that other users can build upon.
                            And the enterprise data foundation goes where the business drives it.
                        </p>
                        <p>Start the revolution. Unleash the power of data integration with Palantir Foundry.</p>
                        <ContextMenu
                            content={
                                <Menu>
                                    <MenuItem text="Menu Item 1" />
                                </Menu>
                            }
                        >
                            <Button onClick={handleClose}>
                                Right Click for a <Code>&lt;ContextMenu /&gt;</Code>
                            </Button>
                        </ContextMenu>
                    </div>
                </div>
                <div className={Classes.DRAWER_FOOTER}>Footer</div>
            </Drawer>
        </Example>
    );
};

const SIZES: Array<string | OptionProps> = [
    { label: "Default", value: "default" },
    { label: "Small", value: DrawerSize.SMALL },
    { label: "Standard", value: DrawerSize.STANDARD },
    { label: "Large", value: DrawerSize.LARGE },
    "72%",
    "560px",
];

const POSITION_OPTIONS = [
    { value: Position.TOP },
    { value: Position.RIGHT },
    { value: Position.BOTTOM },
    { value: Position.LEFT },
];
